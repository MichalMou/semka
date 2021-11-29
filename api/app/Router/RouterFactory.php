<?php

declare(strict_types=1);

namespace App\Router;

use Nette;
use Nette\Application\Routers\RouteList;


final class RouterFactory
{
	use Nette\StaticClass;

	public static function createRouter(): RouteList
	{
		$router = new RouteList;
		// $router->addRoute('<presenter>/<action>[/<id>]', 'Homepage:default'); 
		$router->addRoute('homepage/test', 'Homepage:test'); 
		$router->addRoute('home/dom/<key>','Homepage:dom');
		$router->addRoute('user/login','User:login');
		$router->addRoute('user/register','User:register');
		$router->addRoute('user/load','User:load');
		$router->addRoute('user/profile','User:edit');
		return $router;
	}
}
