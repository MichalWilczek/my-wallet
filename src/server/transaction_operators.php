<?php
require_once("db.php");
require_once("user_data.php");
require_once("transactions.php");


class IncomeDataValidator {
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

    function getAmount() {
        return $this->amount;
    }
    function getDate() {
        return $this->date;
    }
    function getType() {
        return $this->type;
    }
    function getComment() {
        return $this->comment;
    }
    function getTransactionID() {
        return $this->transactionID;
    }
    function getErrors() {
        return $this->inputErrors;
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

class ExpenseDataValidator extends IncomeDataValidator {
    
    protected $paymentOption;

    function __construct() {
        parent::__construct();
        $this->typeName = "expense";
    }

    function getPaymentOption() {
        return $this->paymentOption;
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

interface TransactionOperator {
    function validateInput();
    function runOperationInDb($dbConnect, $userID);
}

class IncomeTransactionAddition implements TransactionOperator {

    protected $validator;

    function __construct() {
        $this->validator = new IncomeDataValidator();
    }

    function validateInput() {
        $this->validator->validateAmount();
        $this->validator->validateDate();
        $this->validator->validateType();
        $this->validator->validateComment();
        return $this->validator->getErrors();
    }
    function runOperationInDb($dbConnect, $userID) {
        try {
            $incomeCategoryID = getTransactionOptionIDAssignedToUser($dbConnect, $userID, "incomeTables", $this->validator->getType());
            $query = $dbConnect->prepare("INSERT INTO incomes VALUES (NULL, :user_id, :income_category_assigned_to_user_id, :amount, :date_of_income, :income_comment)");
            $query->bindValue(":user_id", $userID, PDO::PARAM_INT);
            $query->bindValue(":income_category_assigned_to_user_id", $incomeCategoryID, PDO::PARAM_INT);
            $query->bindValue(":amount", $this->validator->getAmount());
            $query->bindValue(":date_of_income", $this->validator->getDate(), PDO::PARAM_STR);
            $query->bindValue(":income_comment", $this->validator->getComment(), PDO::PARAM_STR);
            $query->execute();
            return [];
        } catch (Exception $error) {
            $errors["db_connection"] = "Server error while adding income record! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error while adding income record! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error while adding income record! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error while adding income record! Apologies for inconvenience. Please, register at another time.";
            return $errors;
        }
    }
}

class ExpenseTransactionAddition extends IncomeTransactionAddition {

    function __construct() {
        parent::__construct();
        $this->validator = new ExpenseDataValidator();
    }

    function validateInput() {
        parent::validateInput();
        $this->validator->validatePaymentOption();
        return $this->validator->getErrors();
    }
    function runOperationInDb($dbConnect, $userID) {
        try {
            $expenseCategoryID = getTransactionOptionIDAssignedToUser($dbConnect, $userID, "expenseTables", $this->validator->getType());
            $paymentOptionID = getTransactionOptionIDAssignedToUser($dbConnect, $userID, "paymentTables", $this->validator->getPaymentOption());
            $query = $dbConnect->prepare("INSERT INTO expenses VALUES (NULL, :user_id, :expense_category_assigned_to_user_id, :payment_method_assigned_to_user_id, :amount, :date_of_expense, :expense_comment)");
            $query->bindValue(":user_id", $userID, PDO::PARAM_INT);
            $query->bindValue(":expense_category_assigned_to_user_id", $expenseCategoryID, PDO::PARAM_INT);
            $query->bindValue(":payment_method_assigned_to_user_id", $paymentOptionID, PDO::PARAM_INT);
            $query->bindValue(":amount", $this->validator->getAmount());
            $query->bindValue(":date_of_expense", $this->validator->getDate(), PDO::PARAM_STR);
            $query->bindValue(":expense_comment", $this->validator->getComment(), PDO::PARAM_STR);
            $query->execute();
            return [];
        } catch (Exception $error) {
            $errors["db_connection"] = "Server error while adding expense record! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error while adding expense record! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error while adding expense record! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error while adding expense record! Apologies for inconvenience. Please, register at another time.";
            return $errors;
        }
    }
}

class IncomeTransactionDeletion implements TransactionOperator {

    protected $validator;

    function __construct() {
        $this->validator = new IncomeDataValidator();
    }

    function validateInput() {
        $this->validator->validateTransactionID();
        return $this->validator->getErrors();
    }

    function _getQuery($dbConnect) {
        $query = $dbConnect->prepare("DELETE FROM incomes WHERE id=:transactionID AND user_id=:userID");
        return $query;
    }

    function runOperationInDb($dbConnect, $userID) {
        try {
            $query = $this->_getQuery($dbConnect);
            $query->bindValue(":transactionID", $this->validator->getTransactionID(), PDO::PARAM_INT);
            $query->bindValue(":user_id", $userID, PDO::PARAM_INT);
            $query->execute();
            return [];
        } catch (Exception $error) {
            $errors["db_connection"] = "Server error while deleting transaction record! Apologies for inconvenience. Please, delete transaction at another time.";
            $errors["db_connection"] = "Server error while deleting transaction record! Apologies for inconvenience. Please, delete transaction at another time.";
            $errors["db_connection"] = "Server error! Apologies for inconvenience. Please, delete transaction at another time.";
            $errors["db_connection"] = "Server error while deleting transaction record! Apologies for inconvenience. Please, delete transaction at another time.";
            $errors["db_connection"] = "Server error while deleting transaction record! Apologies for inconvenience. Please, delete transaction at another time.";
            return $errors;
        }
    }
}

class ExpenseTransactionDeletion extends IncomeTransactionDeletion {

    function __construct() {
        parent::__construct();
        $this->validator = new ExpenseDataValidator();
    }

    function _getQuery($dbConnect) {
        $query = $dbConnect->prepare("DELETE FROM expenses WHERE id=:transactionID AND user_id=:userID");
        return $query;
    }
}

class IncomeTransactionModification implements TransactionOperator {

    protected $validator;

    function __construct() {
        $this->validator = new IncomeDataValidator();
    }

    function validateInput() {
        $this->validator->validateAmount();
        $this->validator->validateDate();
        $this->validator->validateType();
        $this->validator->validateComment();
        $this->validator->validateTransactionID();
    }

    function runOperationInDb($dbConnect, $userID) {
        try {
            $incomeCategoryID = getTransactionOptionIDAssignedToUser($dbConnect, $userID, "incomeTables", $this->validator->getType());
            $query = $dbConnect->prepare("UPDATE incomes SET user_id=:user_id, income_category_assigned_to_user_id=:income_category_assigned_to_user_id, amount=:amount, date_of_income=:date_of_income, income_comment=:income_comment WHERE id=:id");
            $query->bindValue(":user_id", $userID, PDO::PARAM_INT);
            $query->bindValue(":income_category_assigned_to_user_id", $incomeCategoryID, PDO::PARAM_INT);
            $query->bindValue(":amount", $this->validator->getAmount());
            $query->bindValue(":date_of_income", $this->validator->getDate(), PDO::PARAM_STR);
            $query->bindValue(":income_comment", $this->validator->getComment(), PDO::PARAM_STR);
            $query->bindValue(":id", $this->validator->getTransactionID(), PDO::PARAM_INT);
            $query->execute();
            return [];
        } catch (Exception $error) {
            $errors["db_connection"] = "Server error while modifying income record! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error while modifying income record! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error while modifying income record! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error while modifying income record! Apologies for inconvenience. Please, register at another time.";
            return $errors;
        }
    }
}

class ExpenseTransactionModification extends IncomeTransactionModification {

    function __construct() {
        parent::__construct();
        $this->validator = new ExpenseDataValidator();
    }

    function validateInput() {
        parent::validateInput();
        $this->validator->validatePaymentOption();
        return $this->validator->getErrors();
    }
    
    function runOperationInDb($dbConnect, $userID) {
        try {
            $expenseCategoryID = getTransactionOptionIDAssignedToUser($dbConnect, $userID, "expenseTables", $this->validator->getType());
            $paymentOptionID = getTransactionOptionIDAssignedToUser($dbConnect, $userID, "paymentTables", $this->validator->getPaymentOption());
            $query = $dbConnect->prepare("UPDATE expenses SET user_id=:user_id, expense_category_assigned_to_user_id=:expense_category_assigned_to_user_id, payment_method_assigned_to_user_id=:payment_method_assigned_to_user_id, amount=:amount, date_of_expense=:date_of_expense, expense_comment:expense_comment WHERE id=:id");
            $query->bindValue(":user_id", $userID, PDO::PARAM_INT);
            $query->bindValue(":expense_category_assigned_to_user_id", $expenseCategoryID, PDO::PARAM_INT);
            $query->bindValue(":payment_method_assigned_to_user_id", $paymentOptionID, PDO::PARAM_INT);
            $query->bindValue(":amount", $this->validator->getAmount());
            $query->bindValue(":date_of_expense", $this->validator->getDate(), PDO::PARAM_STR);
            $query->bindValue(":expense_comment", $this->validator->getComment(), PDO::PARAM_STR);
            $query->bindValue(":id", $this->validator->getTransactionID(), PDO::PARAM_INT);
            $query->execute();
            return [];
        } catch (Exception $error) {
            $errors["db_connection"] = "Server error while modifying expense record! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error while modifying expense record! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error while modifying expense record! Apologies for inconvenience. Please, register at another time.";
            $errors["db_connection"] = "Server error while modifying expense record! Apologies for inconvenience. Please, register at another time.";
            return $errors;
        }
    }
}
?>