<?php

namespace App\Models;

use PDO;
use \App\Models\TableNames\Income;
use \App\Models\TransactionCategory;


class UserIncome extends \App\Models\UserTransaction {
    protected $incomeCategoryTableName;
    protected $incomeCategory;

    protected $incomeOption;

    public function __construct($userID, $data = []) {
        parent::__construct($userID, $data);
        
        $incomeTableData = new Income();
        $this->incomeCategoryTableName = $incomeTableData->tableName;
        $this->incomeCategory = new TransactionCategory($userID, $this->incomeCategoryTableName);
    }

    public function get($dateFrom, $dateTo) {
        $db = static::getDB();
        $stmt = $db->prepare(
            "SELECT 
                incomes_user.id,
                incomes_user.amount,
                incomes_user.date_of_income,
                $this->incomeCategoryTableName.name,
                incomes_user.income_comment
            FROM (SELECT * FROM incomes WHERE incomes.user_id = :userID) as incomes_user
            INNER JOIN $this->incomeCategoryTableName
            ON incomes_user.income_category_assigned_to_user_id = $this->incomeCategoryTableName.id
            WHERE 
                incomes_user.date_of_income >= :dateFrom
                AND incomes_user.date_of_income <= :dateTo
            "
        );
        $stmt->bindValue(":userID", $this->userID, PDO::PARAM_INT);
        $stmt->bindValue(":dateFrom", $dateFrom, PDO::PARAM_STR);
        $stmt->bindValue(":dateTo", $dateTo, PDO::PARAM_STR);
        $stmt->execute();
        $resultsRows = $stmt->fetchAll();
        $results = [];
        foreach($resultsRows as $row) {
            array_push($results, 
                [
                    "id" => $row["id"],
                    "amount" => $row["amount"],
                    "issue_date" => $row["date_of_income"],
                    "category" => $row["name"],
                    "comment" => $row["income_comment"]
                ]
            );
        }
        return $results;
    }

    public function add() {
        $this->validateAmount();
        $this->validateDate();
        $this->validateIncomeOption();
        $this->validateComment();
        if (!$this->checkValidate()) {
            return false;
        }
        
        $db = static::getDB();

        $incomeCategoryID = $this->incomeCategory->getID($this->incomeOption);
        $stmt = $db->prepare("INSERT INTO incomes VALUES (NULL, :user_id, :income_category_assigned_to_user_id, :amount, :date_of_income, :income_comment)");
        $stmt->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
        $stmt->bindValue(":income_category_assigned_to_user_id", $incomeCategoryID, PDO::PARAM_INT);
        $stmt->bindValue(":amount", $this->amount);
        $stmt->bindValue(":date_of_income", $this->date, PDO::PARAM_STR);
        $stmt->bindValue(":income_comment", $this->comment, PDO::PARAM_STR);
        
        return $stmt->execute();
    }

    public function delete() {
        $this->validateTransactionID();
        if (!$this->checkValidate()) {
            return false;
        }

        $db = static::getDB();
        $stmt = $db->prepare("DELETE FROM incomes WHERE id=:transaction_id AND user_id=:user_id");
        $stmt->bindValue(":transaction_id", $this->transactionID, PDO::PARAM_INT);
        $stmt->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
        
        return $stmt->execute();
    }

    public function modify() {
        $this->validateAmount();
        $this->validateDate();
        $this->validateIncomeOption();
        $this->validateComment();
        $this->validateTransactionID();
        if (!$this->checkValidate()) {
            return false;
        }

        $db = static::getDB();

        $incomeCategoryID = $this->incomeCategory->getID($this->incomeOption);
        $stmt = $db->prepare("UPDATE incomes SET user_id=:user_id, income_category_assigned_to_user_id=:income_category_assigned_to_user_id, amount=:amount, date_of_income=:date_of_income, income_comment=:income_comment WHERE id=:id");
        $stmt->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
        $stmt->bindValue(":income_category_assigned_to_user_id", $incomeCategoryID, PDO::PARAM_INT);
        $stmt->bindValue(":amount", $this->amount);
        $stmt->bindValue(":date_of_income", $this->date, PDO::PARAM_STR);
        $stmt->bindValue(":income_comment", $this->comment, PDO::PARAM_STR);
        $stmt->bindValue(":id", $this->transactionID, PDO::PARAM_INT);

        return $stmt->execute();
    }

    protected function validateIncomeOption() {
        if (filter_var($this->incomeOption, FILTER_SANITIZE_FULL_SPECIAL_CHARS) == false) {
            $this->errors["Income option"] = "Not a string.";
        }
        if (is_null($this->incomeOption) || $this->incomeOption == 'income-option') {
            $this->errors["Income option"] = "Not specified.";
        }
    }
}