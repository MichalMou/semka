<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;
use Nette\Utils\Json;
use stdClass;

final class UserPresenter extends Nette\Application\UI\Presenter
{
    private $database;

    public function __construct(Nette\Database\Connection $database){
        $this->database = $database;
    }

    public function allowCors(): Nette\Http\Response {

        $res = $this->getHttpResponse();

        $res->setHeader('Access-Control-Allow-Origin', $this->getHttpRequest()->getHeader('Origin'));

        $res->setHeader('Access-Control-Allow-Credentials', 'true');

        $res->setHeader('Access-Control-Allow-Methods', 'POST');

        $res->setHeader('Access-Control-Allow-Headers', 'Accept, Overwrite, Destination, Content-Type, Depth, User-Agent, Translate, Range, Content-Range, Timeout, X-Requested-With, If-Modified-Since, Cache-Control, Location');

        return $res;

    }

    public function actionDom($key){
        $object = new stdClass();
        $object->key = $key;
        $object->sprava = "halo halo";

        $this->sendJson($object);
    }

    // vrati sa 
    // true ak sa naslo meno a heslo je spravne
    // false ak je heslo zle
    // 
    public function actionLogin() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            //rozbali poziadavku
            $body = Json::decode($req->getRawBody());

            //vytvori sa novy objekt
            $object = new stdClass();
            $object->err = "";
            $object->status = false;
            
            // TODO osetrit heslo
            $hashedHeslo = md5($body->heslo. + '');

            // vykona query
            $data = $this->database->query("SELECT user, heslo FROM pouzivatelia WHERE user = ? ", $body->userMeno)->fetchAll();

            // ak sa vrati neprazdna tak posli spravu uspesny login 
            if (count($data) === 0) {
                if($data[0]->heslo = $body->heslo) {
                    $object->status = true;
                } else {
                    $object->status = false;
                    $object->err = "heslo";
                }

            } else {
                $object->status = false;
                $object->err = "userName";
            }

            $this->sendJson($object);

        } else {
            $this->sendJson(null);
        }  
    }

    public function register() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            //rozbali poziadavku
            $body = Json::decode($req->getRawBody());

            //vytvori sa novy objekt
            $object = new stdClass();
            $object->err = "";
            $object->status = false;
            
            // TODO osetrit heslo
            $hashedHeslo = md5($body->heslo. + '');

            // vykona query
            $data = $this->database->query("SELECT user, heslo FROM pouzivatelia WHERE user = ? ", $body->userMeno)->fetchAll();
            $data = $this->database->query("SELECT user, heslo FROM pouzivatelia WHERE user = ? ", $body->userMeno)->fetchAll();

            // ak sa vrati neprazdna tak posli spravu uspesnu registraciu 
            if (count($data) === 0) {
                $data = $this->database->query(" ", $body->userMeno)->fetchAll();
                

            } else {
               
            }

            $this->sendJson($object);

        } else {
            $this->sendJson(null);
        }  
    }

    public function delete() {
        
    }

    public function edit() {
        
    }
}
