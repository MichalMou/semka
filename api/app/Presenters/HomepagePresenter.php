<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;
use stdClass;

final class HomepagePresenter extends Nette\Application\UI\Presenter
{
    private $database;

    public function __construct(Nette\Database\Connection $database){
        $this->database = $database;
    }

    public function actionTest(){
        $object = new stdClass();
        $object->sprava = "halo halo";
        $this->sendJson($object);
    }

    public function actionDom($key){
        $object = new stdClass();
        $object->key = $key;
        $object->sprava = "halo halo";

        $this->sendJson($object);
    }

    public function actionLogin() {
        
    }
}
