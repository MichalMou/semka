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

    public function actionLogin() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            $body = Json::decode($req->getRawBody());
            $data = $this->database->query("SELECT * FROM pouzivatelia where User = " + $body->userMeno + " and Heslo = " + $body->heslo)->fetchAll();

            $object = new stdClass();
            $object->meno = $body->userMeno;
            $object->hesloUser = $body->heslo;
            $this->sendJson($object);
        }   
        $this->sendJson(null);
    }

    

    
}
