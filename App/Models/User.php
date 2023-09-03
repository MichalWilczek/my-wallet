<?php

namespace App\Models;

use PDO, PDOException;

use \Core\View;

use \App\Token;
use \App\Mail;

use \App\Models\TransactionCategory;
use \App\Models\TableNames\Income;
use \App\Models\TableNames\Expense;
use \App\Models\TableNames\Payment;


class User extends \Core\Model {
    public $id = null;
    public $username = null;
    public $email = null;
    public $password = null;
    public $passwordRepeated = null;
    
    public $is_active = null;
    public $activation_token = null;
    public $activation_hash = null;

    public $password_reset_hash = null;
    public $password_reset_token = null;
    public $password_reset_expires_at = null;
    
    public $errors = [];

    public function __construct($data = []) {
        foreach($data as $key => $value) {
            $this->$key = $value;
        };
    }

    public function add() {
        try {
            $this->validate();

            if (empty($this->errors)) {
    
                $passwordHash = password_hash($this->password, PASSWORD_DEFAULT);

                $token = new Token();
                $hashedToken = $token->getHash();
                $this->activation_token = $token->getValue();
    
                $sql = 'INSERT INTO users (username, email, password, activation_hash)
                        VALUES (:name, :email, :password_hash, :activation_hash)';
    
                $db = static::getDB();
                $stmt = $db->prepare($sql);
    
                $stmt->bindValue(':name', $this->username, PDO::PARAM_STR);
                $stmt->bindValue(':email', $this->email, PDO::PARAM_STR);
                $stmt->bindValue(':password_hash', $passwordHash, PDO::PARAM_STR);
                $stmt->bindValue(':activation_hash', $hashedToken, PDO::PARAM_STR);
                
                if ($stmt->execute()) {
                    $user = $this->findByEmail($this->email);
                    $this->addDefaultUserCategories($user->id);
                    return true;    
                }

                return false;
            }
            return false;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }  
    }

    public static function authenticate($email, $password) {
        try {
            $user = static::findByEmail($email);

            if ($user && $user->is_active) {
                if (password_verify($password, $user->password)) {
                    return $user;
                }
            }

            return false;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }  
    }

    public static function emailExists($email, $ignoreID=null) {
        try {
            $user = static::findByEmail($email);

            if ($user && $user->id != $ignoreID) {
                return true;
            }
            
            return false;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }  

        return false;
    }

    public static function findByEmail($email) {
        try {
            $db = static::getDB();
            $sql = "SELECT * FROM users WHERE email = :email";

            $stmt = $db->prepare($sql);
            $stmt->bindValue(":email", $email, PDO::PARAM_STR);
            $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
            $stmt->execute();

            return $stmt->fetch();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }  
    }

    public static function findByID($id) {
        try {
            $db = static::getDB();
            $sql = "SELECT * FROM users WHERE id = :id";

            $stmt = $db->prepare($sql);
            $stmt->bindValue(":id", $id, PDO::PARAM_INT);
            $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
            $stmt->execute();

            return $stmt->fetch();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }  
    }

    protected function addDefaultUserCategories($userID) {
        $incomeTableData = new Income();
        $incomeCategory = new TransactionCategory($userID, $incomeTableData->tableName);
        $incomeCategory->addDefault($incomeTableData->defaultTableName);

        $expenseTableData = new Expense();
        $expenseCategory = new TransactionCategory($userID, $expenseTableData->tableName);
        $expenseCategory->addDefault($expenseTableData->defaultTableName);

        $paymentTableData = new Payment();
        $paymentCategory = new TransactionCategory($userID, $paymentTableData->tableName);
        $paymentCategory->addDefault($paymentTableData->defaultTableName);
    }

    protected function validate() {
        // User name
        if (is_null($this->username)) {
            $this->errors["username"] = "User name not set";
        }
        if (strlen($this->username) < 3 || strlen($this->username) > 30) {
            $this->errors["username"] = "User name needs between 3 and 30 signs.";
        }
        if (ctype_alnum($this->username) == false) {
            $this->errors["username"] = "User name must only contain alphanumeric elements.";
        }

        // Email address
        if (is_null($this->email)) {
            $this->errors["email"] = "Email not set";
        }
        $sanitised_email = filter_var($this->email, FILTER_SANITIZE_EMAIL);
        if (filter_var($sanitised_email, FILTER_VALIDATE_EMAIL) == false || $this->email != $sanitised_email) {
            $this->errors["email"] = "Invalid email.";
        }
        if (static::emailExists($this->email, $this->id)) {
            $this->errors["email"] = "Email already taken.";
        }

        // Password
        if (is_null($this->password) || is_null($this->passwordRepeated)) {
            $this->errors["password"] = "Password not set";
        }
        if (strlen($this->password) < 8 || strlen($this->password) > 30) {
            $this->errors["password"] = "Password needs between 8 and 30 signs.";
        }
        if ($this->password != $this->passwordRepeated) {
            $this->errors["password"] = "Passwords not identical.";
        }

        if (count($this->errors) > 0) {
            return false;
        }
        return true;
    }

    public static function sendPasswordReset($email) {
        $user = static::findByEmail($email);
        if ($user) {
            if ($user->startPasswordReset()) {
                $user->sendPasswordResetEmail();
            }
        }
    }

    protected function startPasswordReset() {
        $token = new Token();
        $hashedToken = $token->getHash();
        $this->password_reset_token = $token->getValue();

        $expiryTimestamp = time() + 60 * 60 * 2;  // 2 hours from now

        try {
            $sql = "UPDATE users 
                    SET password_reset_hash = :password_reset_hash,
                        password_reset_expires_at = :expires_at
                    WHERE id = :id";

            $db = static::getDB();
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":password_reset_hash", $hashedToken, PDO::PARAM_STR);
            $stmt->bindValue(":expires_at", date('Y-m-d H:i:s', $expiryTimestamp), PDO::PARAM_STR);
            $stmt->bindValue(":id", $this->id, PDO::PARAM_INT);

            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }  
    }

    protected function sendPasswordResetEmail() {
        $url = 'http://' . $_SERVER['HTTP_HOST'] . '/password/reset/' . $this->password_reset_token;

        $text = View::getTemplate('Password/reset_email.txt', ['url' => $url]);
        $html = View::getTemplate('Password/reset_email.html', ['url' => $url]);

        Mail::send($this->email, 'My Wallet - Password Reset', $text, $html);
    }

    public static function findByPasswordReset($token) {
        $token = new Token($token);
        $hashedToken = $token->getHash();
        $currentTimestamp = date('Y-m-d H:i:s');

        try {
            $sql = "SELECT * 
                    FROM users
                    WHERE password_reset_hash = :token_hash
                    AND password_reset_expires_at > :current_timestamp";

            $db = static::getDB();
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":token_hash", $hashedToken, PDO::PARAM_STR);
            $stmt->bindValue(":current_timestamp", $currentTimestamp, PDO::PARAM_STR);
            $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
            $stmt->execute();

            return $stmt->fetch();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }  
    }

    public function resetPasword($password, $passwordRepeated) {
        $this->password = $password;
        $this->passwordRepeated = $passwordRepeated;
        $this->validate();

        if (empty($this->errors)) {
            $passwordHash = password_hash($this->password, PASSWORD_DEFAULT);

            try {
            $sql = 'UPDATE users
                    SET password = :password_hash,
                        password_reset_hash = NULL,
                        password_reset_expires_at = NULL
                    WHERE id = :id';

            $db = static::getDB();
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":password_hash", $passwordHash, PDO::PARAM_STR);
            $stmt->bindValue(":id", $this->id, PDO::PARAM_INT);

            return $stmt->execute();

            } catch (PDOException $e) {
                echo $e->getMessage();
            }  
        }
        return false;
    }

    public function sendActivationEmail() {
        $url = 'http://' . $_SERVER['HTTP_HOST'] . '/account/activate/' . $this->activation_token;

        $text = View::getTemplate('Signup/activation_email.txt', ['url' => $url]);
        $html = View::getTemplate('Signup/activation_email.html', ['url' => $url]);

        Mail::send($this->email, 'My Wallet - Account Activation', $text, $html);
    }

    public static function activate($token) {
        $token = new Token($token);
        $tokenHash = $token->getHash();

        try {
            $sql = 'UPDATE users
                    SET is_active = 1,
                        activation_hash = NULL
                    WHERE activation_hash = :hashed_token';

            $db = static::getDB();
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":hashed_token", $tokenHash, PDO::PARAM_STR);

            return $stmt->execute();

            } catch (PDOException $e) {
                echo $e->getMessage();
            } 
    }
}
