<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;
use Nette\IOException;
use Nette\Utils\FileSystem;
use Nette\Utils\Json;
use stdClass;

final class CommentsPresenter extends Nette\Application\UI\Presenter
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
   
    public function actionSaveComment() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
                
        if($req->getMethod() == 'POST') {
            //rozbali poziadavku
            $body = Json::decode($req->getRawBody());

            //vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;

            $this->database->query("INSERT INTO komenty(reviewUID, text, user) VALUES(?, ?, ?)", $body->rev, $body->text, $body->user);
            $lastId = $this->database->getInsertId();

            $object->message = "Koment úspešne uložený";
            $object->status = true;
            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
    }

    public function actionLoadComment() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            //vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;
            $body = Json::decode($req->getRawBody());

            $data = $this->database->query("SELECT * FROM komenty WHERE reviewUID = ?", $body->rev)->fetchAll();
            
            $object->comments = $data;
            $object->status = true;

            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
    }

    public function actionDeleteComment() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            $body = Json::decode($req->getRawBody());

            $object = new stdClass();
            $object->status = false;

            $data = $this->database->query("DELETE FROM komenty WHERE UID = ?", $body->UID);
            if ($data->getRowCount() > 0) {
                $object->status = true;
                $object->message = "Koment úspešne vymazaný.";
            }
            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
    }

    public function actionEditComment() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            // rozbali poziadavku
            $body = Json::decode($req->getRawBody());

            // vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;
            
            // zmena udajov v DB
            $result = $this->database->query("UPDATE komenty SET text = ? WHERE UID = ?", $body->text, $body->UID);

            // test uspesnosti 
            if($result->getRowCount() === 1) {
                $object->status = true;   
                $object->message = "Komment úspešne zmenený.";  
            } else {
                
                $object->message = "Koment sa nepodarilo zmeniť.";  
            }
            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        } 
        // TODO zmena obrazka
    } 
}
