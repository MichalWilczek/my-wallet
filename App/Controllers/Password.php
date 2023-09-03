<?php 

namespace App\Controllers;

use Core\View;
use App\Models\User;


class Password extends \Core\Controller {

    public function forgotAction() {
        View::renderTemplate('Password/forgot.html');
    }

    public function requestResetAction() {
        User::sendPasswordReset($_POST['email']);

        View::renderTemplate('Password/reset_requested.html');
    }

    public function resetAction() {
        $token = $this->route_params['token'];
        $user = $this->getUserorExit($token);
        View::renderTemplate('Password/reset.html', [
            'token' => $token
        ]);
    }

    public function resetPasswordAction() {
        $token = $_POST['token'];
        $user = $this->getUserorExit($token);
        if ($user->resetPasword($_POST['password'], $_POST['passwordRepeated'])) {
            View::renderTemplate('Password/reset_success.html');
        } else {
            View::renderTemplate('Password/reset.html', [
                'token' => $token,
                'user' => $user
            ]);
        }
    }

    protected function getUserorExit($token) {
        $user = User::findByPasswordReset($token);
        if ($user) {
            return $user;
        } else {
            View::renderTemplate('Password/token_expired.html');
            exit;
        }
    }
}