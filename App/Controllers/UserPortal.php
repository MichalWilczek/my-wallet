<?php

namespace App\Controllers;

use \App\Auth;


class UserPortal extends \App\Controllers\Super\Authenticated {
    public function indexAction()
    {
        if (Auth::isLoggedIn()) {
            $this->redirect('User/index.html');
        } else {
            $this->redirect('Home/index.html');
        }
    }
}
