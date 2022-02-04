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
            $imgs = $body->imgsRev; // [0]

            $this->database->query("INSERT INTO recenzie(nazov, recenzia, obrazky) VALUES(?, ?, ?)", $body->nameRev, $body->textRev, count($imgs));
            $lastId = $this->database->getInsertId();
            $object->Id = $lastId;

            // obrazky
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
            $object->message = "test";

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

    public function actionDeleteReview() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            $body = Json::decode($req->getRawBody());

            $object = new stdClass();
            $object->status = false;

            $resultRev = $this->database->fetch("SELECT * FROM recenzie WHERE UID = ?", $body->UID);
            
            $data = $this->database->query("DELETE FROM recenzie WHERE UID = ?", $body->UID);
            if ($data->getRowCount() === 1) {
                for($_i = 0; $_i < $resultRev->obrazky; $_i++) {
                    try {
                       FileSystem::delete("revImg/obr" .  $body->UID . "num" . $_i . ".dat");
                    } catch(IOException $e) {}
                }

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
            $imgs = $body->imgsRev;

            
            $resultRev = $this->database->fetch("SELECT * FROM recenzie WHERE UID = ?", $body->UID);

            // zmena udajov v DB
            $result = $this->database->query("UPDATE recenzie SET nazov = ?, recenzia = ?, obrazky = ? WHERE UID = ?", $body->nameRev, $body->textRev, count($imgs), $body->UID);

            // test uspesnosti 
            if($result->getRowCount() === 1) {

                for($_i = 0; $_i < $resultRev->obrazky; $_i++) {
                    try {
                       FileSystem::delete("revImg/obr" .  $body->UID . "num" . $_i . ".dat");
                    } catch(IOException $e) {}
                }
    
                for($_j = 0; $_j < count($imgs); $_j++) {
                    try {
                        FileSystem::write("revImg/obr" . $body->UID . "num" . $_j . ".dat", $imgs[$_j]);
                    } catch(IOException $e) {}
                }                

                $object->status = true;   
                $object->message = "Recenzia úspešne zmenená.";  
            } else {
                
                $object->message = "Recenziu sa nepodarilo zmeniť.";  
            }
            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        } 
        // TODO zmena obrazka
    } 

    public function actionLoad() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            //vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;
            $body = Json::decode($req->getRawBody());
            
            $data = $this->database->query("SELECT * FROM recenzie WHERE UID = ?", $body->UID)->fetchAll()[0];
            
            $img = [];
                for ($_i = 0; $_i < $data["obrazky"]; $_i++) {
                     array_push($img, FileSystem::read("revImg/obr" . $data["UID"] . "num" . $_i . ".dat"));
                }
            $object->imgs = $img;
            // try {
                
            // } catch(IOException $e) {}

            $object->revs = $data;
            $object->status = true;
            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
    }

}
