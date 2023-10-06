<?php

namespace App\Models;

use PDO;


class TransactionCategory extends \Core\Model {
    protected $userID;
    protected $tableName;

    protected $categoryID;
    protected $transactionName;
    protected $errors = [];

    public function __construct($userID, $tableName, $data = []) {
        $this->userID = $userID;
        $this->tableName = $tableName;

        foreach($data as $key => $value) {
            $this->$key = $value;
        };
    }

    public function get() {
        $db = static::getDB();

        $stmt = $db->prepare("SELECT id, name FROM $this->tableName WHERE user_id = :user_id");
        $stmt->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
        $stmt->execute();
        $categories = $stmt->fetchAll();

        return array_map(function ($category) {
            return [
                'id' => $category['id'],
                'name' => $category['name'],
            ];
        }, $categories);
    }

    public function add() {
        $this->validateTransactionName();
        if (!$this->checkValidate()) {
            return false;
        }

        $db = static::getDB();

        $stmt = $db->prepare("INSERT INTO $this->tableName VALUES(NULL, :user_id, :name)");
        $stmt->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
        $stmt->bindValue(":name", $this->transactionName, PDO::PARAM_STR);

        return $stmt->execute();
    }

    public function addDefault($defaultTableName) {
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
    }

    public function modify() {
        $this->validateID();
        $this->validateTransactionName();
        if (!$this->checkValidate()) {
            return false;
        }

        $db = static::getDB();

        $stmt = $db->prepare("UPDATE $this->tableName SET name = :name WHERE user_id = :user_id AND id = :id");
        $stmt->bindValue(":name", ucfirst($this->transactionName), PDO::PARAM_STR);
        $stmt->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
        $stmt->bindValue(":id", $this->categoryID, PDO::PARAM_INT);
        
        return $stmt->execute();
    }

    public function delete() {
        $this->validateID();
        if (!$this->checkValidate()) {
            return false;
        }

        $db = static::getDB();

        $stmt = $db->prepare("DELETE FROM $this->tableName WHERE user_id = :user_id AND id = :id");
        $stmt->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
        $stmt->bindValue(":id", $this->categoryID, PDO::PARAM_INT);
        
        return $stmt->execute();
    }

    public function getID($name) {
        $db = static::getDB();

        $stmt = $db->prepare("SELECT id FROM $this->tableName WHERE user_id = :user_id AND name = :transactionName");
        $stmt->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
        $stmt->bindValue(":transactionName", $name, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch();

        return $result["id"];
    }

    protected function validateID() {
        if (filter_var($this->categoryID, FILTER_SANITIZE_NUMBER_INT) == false) {
            $this->errors['category_ID'] = 'Category ID must be an integer.';
        }
    }

    protected function validateTransactionName() {
        if (filter_var($this->transactionName, FILTER_SANITIZE_FULL_SPECIAL_CHARS) == false) {
            $this->errors["transaction_name"] = "Not a string.";
        }
        if ($this->transactionName == "") {
            $this->errors['transaction_name'] = "Transaction name must be at least one character.";
        }
        if (filter_var($this->transactionName, FILTER_SANITIZE_STRING) == false) {
            $this->errors['transaction_name'] = 'Transaction name must be a string.';
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
