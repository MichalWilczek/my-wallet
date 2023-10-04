<?php

namespace App\Controllers;

use \Core\View;
use \App\Auth;
use \App\Flash;
use \App\Response;
use \App\Models\User;


class Account extends \Core\Controller {
    public function loggingAction() {
        View::renderTemplate('Login/index.html');
    }

    public function loginAction() {
        $user = User::authenticate($_POST["email"], $_POST["password"]);
        $rememberMe = isset($_POST["remember_me"]);

        if ($user) {
            Auth::login($user, $rememberMe);    
            $this->redirect('/');
        } else {
            Flash::addMessage('Login unsuccessful, please try again', Flash::WARNING);

            View::renderTemplate('Login/index.html', [
                'email' => $_POST['email'],
                'remember_me' => $rememberMe
            ]);
        }
    }

    public function logoutAction() {
        Auth::logout();
        $this->redirect('/account/welcome-page');
    }

    public function welcomePageAction() {
        $this->redirect('/');
    }

    public function signingUpAction() {
        View::renderTemplate('Signup/index.html');
    }

    public function signupAction() {
        $user = new User($_POST);
        if ($user->add()) {
            $user->sendActivationEmail();
            $this->redirect('/account/signup-success');
        } else {
            View::renderTemplate('Signup/index.html', [
                'user' => $user
            ]);
        }
    }

    public function signupSuccessAction() {
        View::renderTemplate('Signup/success.html');
    }

    public function activateAction() {
        User::activate($this->route_params['token']);
        $this->redirect('/account/activated');
    }

    public function activatedAction() {
        View::renderTemplate('Signup/activated.html');
    }

    public function delete() {
        $user = Auth::getUser();

        if ($user) {
            if ($user->deleteAccount()) {
                Auth::logout();
                http_response_code(200);
                Response::success();
                return;
            }
        }
        http_response_code(404);
        Response::error("Not found");
    }
}
