<?php

namespace App\Controllers;

use \Core\View;
use \App\Auth;


class Home extends \Core\Controller {
    public function indexAction() {
        if (Auth::getUser()) {
            View::renderTemplate('User/index.html', []);
        } else {
            View::renderTemplate('Home/index.html', []);
        }
    }
}
