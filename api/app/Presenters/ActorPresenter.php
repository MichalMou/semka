<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;
use Nette\IOException;
use Nette\Utils\FileSystem;
use Nette\Utils\Json;
use stdClass;

final class ActorPresenter extends Nette\Application\UI\Presenter
{
    private $database;

    public function __construct(Nette\Database\Connection $database){
        $this->database = $database;
    }

    public function allowCors(): Nette\Http\Response {
        // povolene par v hlavicke pre cors a ine, znici session a nacita session podla
        // id lebo inak by vzdy bola ina session kvoli ajaxu
        $res = $this->getHttpResponse();
        $res->setHeader('Access-Control-Allow-Origin', $this->getHttpRequest()->getHeader('Origin'));
        $res->setHeader('Access-Control-Allow-Credentials', 'true');
        $res->setHeader('Access-Control-Allow-Methods', 'POST');
        $res->setHeader('Access-Control-Allow-Headers', 'SID, Accept, Overwrite, Destination, Content-Type, Depth, User-Agent, Translate, Range, Content-Range, Timeout, X-Requested-With, If-Modified-Since, Cache-Control, Location');
        session_destroy();
        session_id($this->getHttpRequest()->getHeader("SID"));
        session_start();

        return $res;
    }
   
    public function actionSaveActor() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
                
        if($req->getMethod() == 'POST') {
            //rozbali poziadavku
            $body = Json::decode($req->getRawBody());

            //vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;

            $this->database->query("INSERT INTO herci(meno, rola, film) VALUES(?, ?, ?)", $body->nameActor, $body->roleActor, $body->UID);
            $lastId = $this->database->getInsertId();
            FileSystem::write("actorImg/obr" . $lastId . ".dat", $body->imgActor);


            $object->message = "Herec úspešne uložený";
            $object->status = true;
            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
    }

    public function actionLoadActor() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            //vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;
            $body = Json::decode($req->getRawBody());

            $data = $this->database->query("SELECT * FROM herci WHERE film = ?", $body->UID)->fetchAll();
            foreach ($data as &$actor) {
                try {
                    $actor["img"] = FileSystem::read("actorImg/obr" . $actor["UID"] .".dat");
                } catch(IOException $e) {}
            }

            $object->actors = $data;
            $object->status = true;


            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
    }

    public function actionDeleteActor() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            $body = Json::decode($req->getRawBody());

            $object = new stdClass();
            $object->status = false;

            $data = $this->database->query("DELETE FROM herci WHERE UID = ?", $body->UID);
            if ($data->getRowCount() > 0) {
                try {
                    FileSystem::delete("actorImg/obr". $body->UID .".dat");
                } catch(IOException $e) {}
                $object->status = true;
                $object->message = "herec úspešne vymazaný.";
            }
            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
    }

    public function actionEditActor() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            // rozbali poziadavku
            $body = Json::decode($req->getRawBody());

            // vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;
            
            // zmena udajov v DB
            $result = $this->database->query("UPDATE herci SET meno = ?, rola = ? WHERE UID = ?", $body->name, $body->role, $body->UID);

            // test uspesnosti 
            if($result->getRowCount() === 1) {
                if (isset($body->img)) {
                    try {
                        FileSystem::delete("actorImg/obr". $body->UID .".dat");
                    } catch(IOException $e) {}
                    FileSystem::write("actorImg/obr" . $body->UID . ".dat", $body->img);
                    $object->imgMssg = "obr ulozeny";
                }
                
                $object->status = true;   
                $object->message = "Herec úspešne zmenený.";  
            } else {
                
                $object->message = "Herca sa nepodarilo zmeniť.";  
            }
            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        } 
    } 
}
