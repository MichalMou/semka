<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;
use Nette\IOException;
use Nette\Utils\FileSystem;
use Nette\Utils\Json;
use stdClass;

final class ReviewsPresenter extends Nette\Application\UI\Presenter
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
   
    public function actionSaveReview() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
                
        if($req->getMethod() == 'POST') {
            //rozbali poziadavku
            $body = Json::decode($req->getRawBody());

            //vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;
            $imgs[] = $body->imgsRev[0];

            $this->database->query("INSERT INTO recenzie(nazov, recenzia, obrazky) VALUES(?, ?, ?)", $body->nameRev, $body->textRev, count($imgs));
            $lastId = $this->database->getInsertId();
            $object->Id = $lastId;

            // TODO obrazky
            for ($_i = 0; $_i < count($imgs); $_i++) {
                FileSystem::write("revImg/obr" . $lastId . "num" . $_i . ".dat", $imgs[$_i]);
            }

            $object->message = "Recenzia úspešne uložená";
            $object->status = true;
            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
    }

    public function actionLoadReview() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'GET') {
            //vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;

            $data = $this->database->query("SELECT * FROM recenzie")->fetchAll();
            foreach ($data as &$rev) {
               
                try {
                    $img = [];
                    for ($_i = 0; $_i < $rev["obrazky"]; $_i++) {
                        array_push($img, FileSystem::read("revImg/obr" . $rev["UID"] . "num" . $_i . ".dat"));
                    }
                    $rev["img"] = $img;
                } catch(IOException $e) {}
            }
 
            $object->revs = $data;
            $object->status = true;

            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
    }

    // TODO pridat mazanie obrazkov
    public function actionDeleteReview() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            $body = Json::decode($req->getRawBody());

            $object = new stdClass();
            $object->status = false;

            $data = $this->database->query("DELETE FROM recenzie WHERE UID = ?", $body->UID);
            if ($data->getRowCount() > 0) {
                $object->status = true;
                $object->message = "Recenzia úspešne vymazaný.";
            }

            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
    }

    public function actionEditReview() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            // rozbali poziadavku
            $body = Json::decode($req->getRawBody());

            // vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;
                      
            // zmena udajov v DB
            $data_check = $this->database->query("UPDATE novinky SET titul = ?, text = ? WHERE UID = ?", $body->titul, $body->text, $body->UID);
            FileSystem::delete("newsImg/obr". $body->UID .".dat");
            FileSystem::write("newsImg/obr". $body->UID .".dat", $body->img);

            
            //TODO ulozit obrazok

            // test uspesnosti 
            if($data_check->getRowCount() == 1) {
                $object->status = true;   
                $object->message = "Článok úspešne zmenený.";  
            } else {
                $object->message = "Článok sa nepodarilo zmeniť.";  
            }
            
            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        } 
        // TODO zmena obrazka
    } 
}
