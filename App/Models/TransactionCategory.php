<?php

namespace App\Models;

use PDO, PDOException;


class TransactionCategory extends \Core\Model {
    protected $userID;
    protected $tableName;

    protected $transactionName;
    protected $newTransactionName;
    protected $errors = [];

    public function __construct($userID, $tableName, $data = []) {
        $this->userID = $userID;
        $this->tableName = $tableName;

        foreach($data as $key => $value) {
            $this->$key = $value;
        };
    }

    public function get() {
        try {
            $db = static::getDB();

            $stmt = $db->prepare("SELECT name FROM $this->tableName WHERE user_id = :user_id");
            $stmt->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
            $stmt->execute();
            $categories = $stmt->fetchAll();

            $results = [];
            foreach($categories as $category) {
                array_push($results, $category["name"]);
            }
            
            return $results;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    public function add() {
        $this->validateTransactionName();
        if (!$this->checkValidate()) {
            return false;
        }

        // TODO: Add function!!!
    }

    public function addDefault($defaultTableName) {
        try {
            $db = static::getDB();

            $stmt1 = $db->prepare("SELECT id, name FROM $defaultTableName");
            $stmt1->execute();
            $defaultCategories = $stmt1->fetchAll();

            if (!empty($defaultCategories)) {
                foreach ($defaultCategories as $category) {
                    $stmt2 = $db->prepare("INSERT INTO $this->tableName VALUES (NULL, :user_id, :name)");
                    $stmt2->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
                    $stmt2->bindValue(":name", $category["name"], PDO::PARAM_STR);
                    $stmt2->execute();
                }
            }

            return true;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    public function modify() {
        $this->validateTransactionName();
        $this->validateNewTransactionName();
        if (!$this->checkValidate()) {
            return false;
        }

        try {
            $db = static::getDB();

            $stmt = $db->prepare("UPDATE $this->tableName SET name = :name WHERE user_id = :user_id AND name = :old_name");
            $stmt->bindValue(":name", ucfirst($this->newTransactionName), PDO::PARAM_STR);
            $stmt->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
            $stmt->bindValue(":old_name", ucfirst($this->transactionName), PDO::PARAM_STR);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    public function delete() {
        $this->validateTransactionName();
        if (!$this->checkValidate()) {
            return false;
        }

        try {
            $db = static::getDB();

            $stmt = $db->prepare("DELETE FROM $this->tableName WHERE user_id = :user_id AND name = :old_name");
            $stmt->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
            $stmt->bindValue(":old_name", ucfirst($this->transactionName), PDO::PARAM_STR);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    public function getID($name) {
        try {
            $db = static::getDB();

            $stmt = $db->prepare("SELECT id FROM $this->tableName WHERE user_id = :user_id AND name = :transactionName");
            $stmt->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
            $stmt->bindValue(":transactionName", $name, PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch();

            return $result["id"];
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    protected function validateTransactionName() {
        if ($this->transactionName == "") {
            $this->errors['transaction_name'] = "Transaction name must be at least one character.";
        }
        if (filter_var($this->transactionName, FILTER_SANITIZE_STRING) == false) {
            $this->errors['transaction_name'] = 'Transaction name must be a string.';
        }
    }

    protected function validateNewTransactionName() {
        if ($this->newTransactionName == "") {
            $this->errors['new_transaction_name'] = "New transaction name must be at least one character.";
        }
        if (filter_var($this->transactionName, FILTER_SANITIZE_STRING) == false) {
            $this->errors['new_transaction_name'] = 'New transaction name must be a string.';
        }
    }

    protected function checkValidate() {
        $success = false;
        if (count($this->errors) == 0) {
            $success = true;
        } 
        $this->errors = [];
        return $success;
    }
}
