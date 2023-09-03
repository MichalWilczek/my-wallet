<?php

namespace App\Models;

use PDO, PDOException;
use \App\Token;


class RememberedLogin extends \Core\Model {
    protected $id;
    protected $user_id;
    protected $token_hash;

    public $rememberToken;
    public $expires_at;

    public function rememberLogin($userID) {
        $token = new Token();
        $hashedToken = $token->getHash();

        $this->rememberToken = $token->getValue();
        $this->expires_at = time() + 60 * 60 * 24 * 30;  // 30 days from now

        try {
            $db = static::getDB();
            $sql = 'INSERT INTO remembered_logins (token_hash, user_id, expires_at)
                    VALUES (:token_hash, :user_id, :expires_at)';

            $stmt = $db->prepare($sql);
            $stmt->bindValue(":token_hash", $hashedToken, PDO::PARAM_STR);
            $stmt->bindValue(":user_id", $userID, PDO::PARAM_INT);
            $stmt->bindValue(":expires_at", date('Y-m-d H:i:s', $this->expires_at), PDO::PARAM_STR);
            return $stmt->execute();

        } catch (PDOException $e) {
            echo $e->getMessage();
        }  
    }

    public static function findByToken($token) {
        $token = new Token($token);
        $tokenHash = $token->getHash();

        try {
            $sql = 'SELECT * FROM remembered_logins
            WHERE token_hash = :token_hash';

            $db = static::getDB();
            $stmt = $db->prepare($sql);
            $stmt->bindValue(':token_hash', $tokenHash, PDO::PARAM_STR);
            $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
            $stmt->execute();

            return $stmt->fetch();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }  
    }

    public function getUser() {
        return User::findByID($this->user_id);
    }

    public function hasExpired() {
        return strtotime($this->expires_at) < time();
    }

    public function delete() {
        try {
            $sql = 'DELETE FROM remembered_logins
                    WHERE token_hash = :token_hash';
            $db = static::getDB();
            $stmt = $db->prepare($sql);
            $stmt->bindValue(':token_hash', $this->token_hash, PDO::PARAM_STR);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }  
    }
}