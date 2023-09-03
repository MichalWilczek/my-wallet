<?php

namespace App;

use \App\Models\User;
use \App\Models\RememberedLogin;


class Auth {

    public static function login($user, $rememberMe) {
        session_regenerate_id(true);
        $_SESSION["user_id"] = $user->id;

        if ($rememberMe) {
            $rememberedLogin = new RememberedLogin();
            if($rememberedLogin->rememberLogin($user->id)) {
                setcookie('remember_me', $rememberedLogin->rememberToken, $rememberedLogin->expires_at, '/');
            }
        }
    }   

    public static function logout() {
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();

            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        };

        session_destroy();
        static::forgetLogin();
    }

    public static function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }

    public static function getUserID() {
        if (Auth::isLoggedIn()) {
            return $_SESSION['user_id'];
        }
    }

    public static function getUser() {
        if (Auth::isLoggedIn()) {
            return User::findByID($_SESSION['user_id']);
        } else {
            return static::loginFromRemeberCookie();
        }
    }

    protected static function loginFromRemeberCookie() {
        $cookie = $_COOKIE['remember_me'] ?? false;

        if ($cookie) {
            $rememberedLogin = RememberedLogin::findByToken($cookie);

            if ($rememberedLogin && !$rememberedLogin->hasExpired()) {
                $user = $rememberedLogin->getUser();
                static::login($user, false);
                return $user;
            }
        }
    }

    protected static function forgetLogin() {
        $cookie = $_COOKIE['remember_me'] ?? false;

        if ($cookie) {
            $rememberedLogin = RememberedLogin::findByToken($cookie);

            if ($rememberedLogin) {
                $rememberedLogin->delete();
            }
            setcookie('remember_me', '', time() - 3600);  // set to expire in the past
        }
    }
}