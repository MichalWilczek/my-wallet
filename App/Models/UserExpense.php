<?php

namespace App\Models;

use PDO;
use \App\Models\TableNames\Expense;
use \App\Models\TableNames\Payment;


class UserExpense extends \App\Models\UserIncome {
    protected $expenseCategoryTableName;
    protected $expenseCategory;

    protected $paymentOptionTableName;
    protected $paymentCategory;

    protected $expenseOption;
    protected $paymentOption;
    
    public function __construct($userID, $data = []) {
        parent::__construct($userID, $data);

        $expenseTableData = new Expense();
        $this->expenseCategoryTableName = $expenseTableData->tableName;
        $this->expenseCategory = new TransactionCategory($userID, $this->expenseCategoryTableName);

        $paymentTableData = new Payment();
        $this->paymentOptionTableName = $paymentTableData->tableName;
        $this->paymentCategory = new TransactionCategory($userID, $this->paymentOptionTableName);
    }

    public function get($dateFrom, $dateTo) {
        $db = static::getDB();
        
        $stmt = $db->prepare(
            "SELECT 
                expenses_user.id,
                expenses_user.amount,
                expenses_user.date_of_expense,
                $this->expenseCategoryTableName.name as expense_category,
                $this->paymentOptionTableName.name as payment_method,
                expenses_user.expense_comment
            FROM (SELECT * FROM expenses WHERE expenses.user_id = :userID) as expenses_user
            INNER JOIN $this->expenseCategoryTableName
            ON expenses_user.expense_category_assigned_to_user_id = $this->expenseCategoryTableName.id
            INNER JOIN $this->paymentOptionTableName
            ON expenses_user.payment_method_assigned_to_user_id = $this->paymentOptionTableName.id
            WHERE 
                expenses_user.date_of_expense >= :dateFrom
                AND expenses_user.date_of_expense <= :dateTo
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
                    "issue_date" => $row["date_of_expense"],
                    "category" => $row["expense_category"],
                    "payment_method" => $row["payment_method"],
                    "comment" => $row["expense_comment"]
                ]
            );
        }
        return $results;
    }

    public function add() {
        $this->validateAmount();
        $this->validateDate();
        $this->validateExpenseOption();
        $this->validateComment();
        $this->validatePaymentOption();
        if (!$this->checkValidate()) {
            return false;
        }

        $db = static::getDB();

        $expenseCategoryID = $this->expenseCategory->getID($this->expenseOption);
        $paymentOptionID = $this->paymentCategory->getID($this->paymentOption);
        
        $stmt = $db->prepare("INSERT INTO expenses VALUES (NULL, :user_id, :expense_category_assigned_to_user_id, :payment_method_assigned_to_user_id, :amount, :date_of_expense, :expense_comment)");
        $stmt->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
        $stmt->bindValue(":expense_category_assigned_to_user_id", $expenseCategoryID, PDO::PARAM_INT);
        $stmt->bindValue(":payment_method_assigned_to_user_id", $paymentOptionID, PDO::PARAM_INT);
        $stmt->bindValue(":amount", $this->amount);
        $stmt->bindValue(":date_of_expense", $this->date, PDO::PARAM_STR);
        $stmt->bindValue(":expense_comment", $this->comment, PDO::PARAM_STR);
        
        return $stmt->execute();
    }

    public function delete() {
        $this->validateTransactionID();
        if (!$this->checkValidate()) {
            return false;
        }

        $db = static::getDB();

        $stmt = $db->prepare("DELETE FROM expenses WHERE id=:transaction_id AND user_id=:user_id");
        $stmt->bindValue(":transaction_id", $this->transactionID, PDO::PARAM_INT);
        $stmt->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
        
        return $stmt->execute();
    }

    public function modify() {
        $this->validateAmount();
        $this->validateDate();
        $this->validateExpenseOption();
        $this->validateComment();
        $this->validateTransactionID();
        $this->validatePaymentOption();
        if (!$this->checkValidate()) {
            return false;
        }

        $db = static::getDB();

        $expenseCategoryID = $this->expenseCategory->getID($this->expenseOption);
        $paymentOptionID = $this->paymentCategory->getID($this->paymentOption);
        
        $stmt = $db->prepare("UPDATE expenses SET user_id=:user_id, expense_category_assigned_to_user_id=:expense_category_assigned_to_user_id, payment_method_assigned_to_user_id=:payment_method_assigned_to_user_id, amount=:amount, date_of_expense=:date_of_expense, expense_comment=:expense_comment WHERE id=:id");
        $stmt->bindValue(":user_id", $this->userID, PDO::PARAM_INT);
        $stmt->bindValue(":expense_category_assigned_to_user_id", $expenseCategoryID, PDO::PARAM_INT);
        $stmt->bindValue(":payment_method_assigned_to_user_id", $paymentOptionID, PDO::PARAM_INT);
        $stmt->bindValue(":amount", $this->amount);
        $stmt->bindValue(":date_of_expense", $this->date, PDO::PARAM_STR);
        $stmt->bindValue(":expense_comment", $this->comment, PDO::PARAM_STR);
        $stmt->bindValue(":id", $this->transactionID, PDO::PARAM_INT);

        return $stmt->execute();
    }

    protected function validateExpenseOption() {
        if (filter_var($this->expenseOption, FILTER_SANITIZE_FULL_SPECIAL_CHARS) == false) {
            $this->errors["Expense option"] = "Not a string.";
        }
        if (is_null($this->expenseOption) || $this->expenseOption == 'expense-option') {
            $this->errors["Expense option"] = "Not specified.";
        }
    }

    protected function validatePaymentOption() {
        if (filter_var($this->paymentOption, FILTER_SANITIZE_FULL_SPECIAL_CHARS) == false) {
            $this->errors["Payment option"] = "Not a string.";
        }
        if (is_null($this->paymentOption) || $this->paymentOption == 'payment-option') {
            $this->errors["Payment option"] = "Not specified.";
        }
    }
}
