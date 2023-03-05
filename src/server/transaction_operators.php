<?php
require_once("db.php");
require_once("user_data.php");
require_once("transactions.php");


interface TransactionOperator {

    // Operations for input data validation
    function validateInputForAddingTransaction();
    function validateInputForDeletingTransaction();
    function validateInputForModifyingTransaction();
    
    // Operations in database
    function saveTransactionToDB($dbConnect, $userID);
    function deleteTransactionInDB($dbConnect, $userID, $transactionID);
    function modifyTransactionInDB($dbConnect, $userID, $transactionID);
}

class IncomeOperator implements TransactionOperator {
	protected $amount;
    protected $date;
    protected $type;
    protected $comment;
    protected $typeName;
    protected $transactionID;
    protected $inputErrors = [];

    function __construct() {
        $this->typeName = "income";
    }
    function validateInputForAddingTransaction() {
        $this->validateAmount();
        $this->validateDate();
        $this->validateType();
        $this->validateComment();
        return $this->inputErrors;
    }
    function validateInputForDeletingTransaction() {
        $this->validateTransactionID();
        return $this->inputErrors;
    }
    function validateInputForModifyingTransaction() {

    }

    function saveTransactionToDB($dbConnect, $userID) {

        try {
            $incomeCategoryID = getTransactionOptionIDAssignedToUser($dbConnect, $userID, "incomeTables", $this->type);
            $query = $dbConnect->prepare("INSERT INTO incomes VALUES (NULL, :user_id, :income_category_assigned_to_user_id, :amount, :date_of_income, :income_comment)");
            $query->bindValue(":user_id", $userID, PDO::PARAM_INT);
            $query->bindValue(":income_category_assigned_to_user_id", $incomeCategoryID, PDO::PARAM_INT);
            $query->bindValue(":amount", $this->amount);
            $query->bindValue(":date_of_income", $this->date, PDO::PARAM_STR);
            $query->bindValue(":income_comment", $this->comment, PDO::PARAM_STR);
            $query->execute();
            return [];

        } catch (Exception $error) {
            $errors["db_connection"] = "Server error! Apologies for inconvenience. Please, register at another time.";
            return $errors;
        }
    }

    function deleteTransactionInDB($dbConnect, $userID, $transactionID) {
        try {
            $query = $dbConnect->prepare("DELETE FROM incomes WHERE id=:transactionID AND user_id=:userID");
            $query->bindValue(":transactionID", $transactionID, PDO::PARAM_INT);
            $query->bindValue(":user_id", $userID, PDO::PARAM_INT);
            $query->execute();
            return [];
        } catch (Exception $error) {
            $errors["db_connection"] = "Server error! Apologies for inconvenience. Please, delete income transaction at another time.";
            return $errors;
        }
    }

    function modifyTransactionInDB($dbConnect, $userID, $transactionID) {

    }

    function validateAmount() {
        $this->amount = filter_input(INPUT_POST, "amount");
        if (filter_var($this->amount, FILTER_VALIDATE_FLOAT) == false) {
            $this->inputErrors["amount"] = "The input cash amount must be a number.";
        }
    }

    function validateDate() {
        $this->date = filter_input(INPUT_POST, "date");
        $format = "Y-m-d";
        $d = DateTime::createFromFormat($format, $this->date);
        if (!($d && $d->format($format) === $this->date)) {
            $this->inputErrors["date_format"] = "The date is put in the wrong format.";
        }
    }

    function validateType() {

        $this->type = filter_input(INPUT_POST, "{$this->typeName}-option");
        if ($this->type == "{$this->typeName}-option") {
            $this->inputErrors["{$this->typeName}_option"] = "You did not specify the {$this->typeName} option.";
        }
        if (filter_var($this->type, FILTER_SANITIZE_STRING) == false) {
            $this->inputErrors["{$this->typeName}_option"] = "The $this->typeName option must be a string.";
        }
    }

    function validateComment() {
        $this->comment = filter_input(INPUT_POST, "comment");
        if ($this->comment == "") {
            return;
        }
        if (filter_var($this->comment, FILTER_SANITIZE_STRING) == false) {
            $this->inputErrors['comment'] = 'The comment input must be a string.';
        }
    }

    function validateTransactionID() {
        $this->transactionID = filter_input(INPUT_POST, "transaction_id");
        if (filter_var($this->transactionID, FILTER_VALIDATE_INT) == false) {
            $this->inputErrors["transaction_id"] = "The transaction_id must be an integer.";
        }
    }
}

class ExpenseOperator extends IncomeOperator {

    protected $paymentOption;

    function __construct() {
        $this->typeName = "expense";
    }

    function validateInputForAddingTransaction() {
        parent::validateInputForAddingTransaction();
        $this->validatePaymentOption();
        return $this->inputErrors;
    }

    function saveTransactionToDB($dbConnect, $userID) {

        try {
            $expenseCategoryID = getTransactionOptionIDAssignedToUser($dbConnect, $userID, "expenseTables", $this->type);
            $paymentOptionID = getTransactionOptionIDAssignedToUser($dbConnect, $userID, "paymentTables", $this->paymentOption);
            $query = $dbConnect->prepare("INSERT INTO expenses VALUES (NULL, :user_id, :expense_category_assigned_to_user_id, :payment_method_assigned_to_user_id, :amount, :date_of_expense, :expense_comment)");
            $query->bindValue(":user_id", $userID, PDO::PARAM_INT);
            $query->bindValue(":expense_category_assigned_to_user_id", $expenseCategoryID, PDO::PARAM_INT);
            $query->bindValue(":payment_method_assigned_to_user_id", $paymentOptionID, PDO::PARAM_INT);
            $query->bindValue(":amount", $this->amount);
            $query->bindValue(":date_of_expense", $this->date, PDO::PARAM_STR);
            $query->bindValue(":expense_comment", $this->comment, PDO::PARAM_STR);
            $query->execute();
            return [];

        } catch (Exception $error) {
            $errors["db_connection"] = "Server error! Apologies for inconvenience. Please, register at another time.";
            return $errors;
        }
    }
    
    function deleteTransactionInDB($dbConnect, $userID, $transactionID) {
        try {
            $query = $dbConnect->prepare("DELETE FROM expenses WHERE id=:transactionID AND user_id=:userID");
            $query->bindValue(":transactionID", $transactionID, PDO::PARAM_INT);
            $query->bindValue(":user_id", $userID, PDO::PARAM_INT);
            $query->execute();
            return [];

        } catch (Exception $error) {
            $errors["db_connection"] = "Server error! Apologies for inconvenience. Please, delete expense transaction at another time.";
            return $errors;
        }
    }

    function validatePaymentOption() {
        $this->paymentOption = filter_input(INPUT_POST, "payment-option");
        if ($this->paymentOption == "payment-option") {
            $this->inputErrors["payment_option"] = "You did not specify the payment option.";
        }
        if (filter_var($this->paymentOption, FILTER_SANITIZE_STRING) == false) {
            $this->inputErrors["payment_option"] = "The payment option must be a string.";
        }
    }
}
?>