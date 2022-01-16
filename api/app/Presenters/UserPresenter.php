<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;
use Nette\Http\Session;
use Nette\Utils\Json;
use stdClass;

final class UserPresenter extends Nette\Application\UI\Presenter
{
    private $database;
    private $session;
    
    // nette si doplni atr sam
    public function __construct(Nette\Database\Connection $database, Session $session){
        $this->database = $database;
        $this->session = $session;
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

    // test funkcia
    public function actionDom($key){
        $object = new stdClass();
        $object->key = $key;
        $object->sprava = "halo halo";

        $this->sendJson($object);
    }

    // vrati sa 
    // true pri uspesnej operacii
    // false pri neuspesnej operacii
    public function actionLogin() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            //rozbali poziadavku
            $body = Json::decode($req->getRawBody());

            //vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;
            
            // TODO osetrit heslo
            $hashedPswd = md5($body->pswd.$body->userName);

            // vykona query
            $data = $this->database->query("SELECT * FROM pouzivatelia WHERE user = ? ", $body->userName);

            // ak sa vrati neprazdna tak posli spravu uspesny login 
            if ($data->getRowCount() == 1) {
                $resultQuery = $data->fetch();
                
                if($resultQuery->pswd = $hashedPswd) {
                    $object->message = "Úspešne prihlásený."; 
                    $object->status = true;
                    $object->email = $resultQuery->mail;

                    // nette ma session rozdelenu do sekcii
                    $sekcia = $this->session->getSection("user");
                    
                    // ukladam si param aby som vedel kto je prihlaseny
                    $sekcia["userName"] = $body->userName;
                    $object->sid = $this->session->getId();

                } else {
                    $object->message = "Zlé heslo"; 
                }

            } else {
                $object->message = "Účet neexistuje."; 
            }

            $this->sendJson($object);

        } else {
            $this->sendJson(null);
        }  
    }

    public function actionLogout() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'GET') {
            //rozbali poziadavku
           
            //vytvori sa novy objekt
            $object = new stdClass();
            $object->status = true;
            
            // nette ma session rozdelenu do sekcii
            $sekcia = $this->session->getSection("user");
                    
            // ukladam si param aby som vedel kto je prihlaseny
            //$sekcia["userName"] = "";
            unset($sekcia["userName"]);
            $this->sendJson($object);

        } else {
            $this->sendJson(null);
        }  
    }

    public function actionRegister() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            //rozbali poziadavku
            $body = Json::decode($req->getRawBody());

            //vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;
            
            // osetrit heslo
            // TODO pridat salt
            $hashedPswd = md5($body->pswd.$body->userName);

            // pridat adminovi prava
            $rights = 0;
            if($body->userName == "admin") {
                $rights = 1;
            }

            // vykona query
            $data = $this->database->query("SELECT user, heslo FROM pouzivatelia WHERE user = ? OR mail = ? ", $body->userName, $body->email);

            // ak sa vrati neprazdna tak posli spravu uspesnu registraciu 
            if ($data->getRowCount() == 0) {
                $data_check = $this->database->query("INSERT INTO pouzivatelia", [
                    'user' => $body->userName,
                    'heslo' => $hashedPswd,
                    'mail' => $body->email,
                    'prava' => $rights
                    ]);
                // test uspesnosti insertu
                if($data_check->getRowCount() == 1) {
                    $object->status = true;   
                    $object->message = "Úspešne zaregistrovaný.";  
                } else {
                    $object->message = "Neuspešná registrácia.";  
                }
               
            } else {
                // test obsadenia mena alebo emailu
                $result = $data->fetch();
                if($result->user == $body->userName) {
                    $object->message = "Meno je už obsadené.";  
                } else {
                    $object->message = "Email je už obsadený.";  
                }   
            }
            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
    }

    public function actionDelete() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            // rozbali poziadavku
            $body = Json::decode($req->getRawBody());

            // vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;
            
            // TODO kontrola kto je prihlaseny

            // zisti sa ci user existuje
            $data = $this->database->query("SELECT user, heslo FROM pouzivatelia WHERE user = ? ", $body->userName);

            // ak existuje tak sa vymaze
            if ($data->getRowCount() == 1) {
                // TODO upravit query
                $data_check = $this->database->query("DELETE FROM pouzivatelia WHERE user = ?", $body->userName);

                // test uspesnosti deletu
                if($data_check->getRowCount() == 1) {
                    $object->status = true;   
                    $object->message = "Účet bol úspešne zmazaný.";  
                } else {
                    // sem by sa to nemalo dostat
                    $object->message = "Problem sa nepodarilo zmazať.";  
                }
            } else {
                $object->message = "Účet už neexistuje.";
            }

            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
    }

    public function actionEdit() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'POST') {
            // rozbali poziadavku
            $body = Json::decode($req->getRawBody());

            // vytvori sa novy objekt
            $object = new stdClass();
            $object->status = false;
            
            // zisti sa ci je meno alebo mail obsadeny
            $data = $this->database->query("SELECT * FROM pouzivatelia WHERE user = ? OR mail = ? ", $body->userNewName, $body->newEmail);
            $queryResult = $data->fetch();  

            // ak existuje tak vrati odpoved ze meno alebo email je uz pouzivany
            if ($data->getRowCount() != 0) {

                // skontroluje sa ci je meno zabrane ak nie tak je email zabrany potom sa vrati odpoved 
                if($queryResult->user == $body->userNewName) {
                    $object->message = "Meno sa už používa. Zadajte iné.";  
                } else {
                    $object->message = "Email sa už používa. Zadajte iný.";  
                }

            } else {
                // priprava udajov na update
                $newPswd = md5($body->newPswd.$body->userNewName);

                // zmena udajov v DB
                $data_check = $this->database->query("UPDATE pouzivatelia SET user = ?, heslo = ?, mail = ? WHERE user = ?", $body->userNewName, $newPswd, $body->newEmail, $body->userName);
               
                // test uspesnosti 
                if($data_check->getRowCount() == 1) {
                    $object->status = true;   
                    $object->message = "Údaje boli úspešne zmenené.";  
                } else {
                    $object->message = "Údaje sa nepodarilo zmeniť.";  
                }
            } 
            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
    }

    // (pri refreshi sa angular resetuje cize data user sa zmazu a musim nacitat znova)
    public function actionLoad() {
        $res = $this->allowCors();
        $req = $this->getHttpRequest();
        
        if($req->getMethod() == 'GET') {
            $object = new stdClass();
            $object->status = false;
            $sekcia = $this->session->getSection("user");
                        
            if(isset($this->session)) {
                if(isset($sekcia["userName"])) {
                    $userName = $sekcia["userName"];
                    $object->userName = $userName;
                    $data = $this->database->query("SELECT * FROM pouzivatelia WHERE user = ? ", $userName);
                    $resultQuery = $data->fetch();
                    if($resultQuery != null) {
                        $object->email =  $resultQuery->mail;
                        $object->rights =  $resultQuery->prava;
                        $object->status = true;
                    } 
                }
            }
            $this->sendJson($object);
        } else {
            $this->sendJson(null);
        }  
        // zobrat sekciu zo session
        // premennu zo sekcie
        //  je premenna nastavena / null  ?
        // ak je nastavena nacitam uzivatela a poslem data meno, privilegia, mail
        // DONE ulozit do userData       
    }
}
