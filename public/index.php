<?php

require '../vendor/autoload.php';

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

$loader = new FilesystemLoader(/* specify your template directory here */);
$twig = new Environment($loader);

error_reporting(E_ALL);
set_error_handler('Core\Error::errorHandler');
set_exception_handler('Core\Error::exceptionHandler');

session_start();

$router = new Core\Router();
$router->add('', ['controller' => 'Home', 'action' => 'index']);
$router->add('{controller}/{action}');
$router->add('{controller}/{action}/{id:\d+}');
$router->add('password/reset/{token:[\da-f]+}', ['controller' => 'Password', 'action' => 'reset']);  // only hexadecimal values accepted
$router->add('account/activate/{token:[\da-f]+}', ['controller' => 'Account', 'action' => 'activate']);  // only hexadecimal values accepted
$router->dispatch($_SERVER['QUERY_STRING']);
