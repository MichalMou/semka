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
		$router->addRoute('homepage/saveNews', 'Homepage:saveNews'); 
		$router->addRoute('homepage/loadNews', 'Homepage:loadNews'); 
		$router->addRoute('homepage/deleteNews', 'Homepage:deleteNews'); 
		$router->addRoute('homepage/editNews', 'Homepage:editNews'); 

		$router->addRoute('reviews/loadSingleReviev/<uid>','Reviews:loadSingleReviev');
		
		$router->addRoute('reviews/saveReview', 'Reviews:saveReview'); 
		$router->addRoute('reviews/loadReview', 'Reviews:loadReview'); 
		$router->addRoute('reviews/deleteReview', 'Reviews:deleteReview'); 
		$router->addRoute('reviews/editReview', 'Reviews:editReview'); 



		$router->addRoute('user/login','User:login');
		$router->addRoute('user/logout','User:logout');
		$router->addRoute('user/register','User:register');
		$router->addRoute('user/load','User:load');
		$router->addRoute('user/edit','User:edit');
		$router->addRoute('user/delete','User:delete');
		return $router;
	}
}
