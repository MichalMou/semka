<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;
use Nette\IOException;
use Nette\Utils\FileSystem;
use Nette\Utils\Json;
use stdClass;

final class HomepagePresenter extends Nette\Application\UI\Presenter
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
   
    public function actionSaveImg() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            //rozbali poziadavku
            $body = Json::decode($req->getRawBody());

            //vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;
            //$object->img = $body->img;

            // TODO zmenit param insertu na veci z body

            $this->database->query("INSERT INTO novinky(titul,text) VALUES(?, ?)","halo", "blabla");
            $lastId = $this->database->getInsertId();
            $object->Id = $lastId;
            FileSystem::write("newsImg/obr". $lastId .".dat", $body->img);

            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
    }

    public function actionLoadImg() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'GET') {
            //vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;

            $data = $this->database->query("SELECT * FROM novinky")->fetchAll();
            foreach ($data as &$news) {
               
                try {
                    $news["img"] = FileSystem::read("newsImg/obr". $news["UID"] .".dat");
                } catch(IOException $e) {}
            }

            $object->news = $data;
            //$object->img = FileSystem::read("newsImg/obr.dat");



            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
    }

    // TODO loadNews
  

    // TODO loadItem

    // TODO addNews

    // TODO deleteNews

    // TODO editNews

}
