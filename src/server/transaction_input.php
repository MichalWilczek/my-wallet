<?php
require_once("db.php");
require_once("user_data.php");
require_once("transactions.php");


function getTransactionOperator() {
    if (isset($_POST["amount"]) && isset($_POST["date"])) {
        if (isset($_POST["income-option"])) {
            return new IncomeOperator();
        }
        if (isset($_POST["expense-option"]) && isset($_POST["payment-option"])) {
            return new ExpenseOperator();
        }
        throw new Exception("Object for checking transaction data cannot be set due to missing post input data.");
    } else {
        throw new Exception("Object for checking transaction data cannot be set due to missing post input data.");
    }
}

interface TransactionOperator {
    function validateInput();
    function saveTransactionToDB($dbConnect, $userID);
}

class IncomeOperator implements TransactionOperator {
	protected $amount;
    protected $date;
    protected $type;
    protected $comment;
    protected $typeName;
    protected $inputErrors = [];

    function __construct() {
        $this->typeName = "income";
    }

    function validateInput() {
        $this->validateAmount();
        $this->validateDate();
        $this->validateType();
        $this->validateComment();
        return $this->inputErrors;
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
}

class ExpenseOperator extends IncomeOperator {

    protected $paymentOption;

    function __construct() {
        $this->typeName = "expense";
    }

    function validateInput() {
        parent::validateInput();
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

function addTransaction ($userID) {
    $transactionOperator = getTransactionOperator();
    $errors = $transactionOperator->validateInput();
    
    if (count($errors) == 0) {
        $dbConnect = connectToDB();
        $errors = $transactionOperator->saveTransactionToDB($dbConnect, $userID);
        if (count($errors) == 0) {
            $result["successful"] = true;
        } else {
            $result["successful"] = false;
        }
    } else {
        $result["successful"] = false;
    }
    $result["errors"] = $errors;
    return $result;
}

$result = [
    "successful" => false,
    "errors" => []
];

session_start();
if (isset($_SESSION["userData"])) {
    $sessionUserData = $_SESSION["userData"];
    try {
        if ($sessionUserData->successful) {
            $result = addTransaction($sessionUserData->id);
        }
    } catch (Exception $error) {
        $result["errors"]["transaction_error"] = "Failed to add transaction.";
    }
} else {
    $result["errors"]["server_error"] = "No user logged in.";
}
header("Content-Type: application/json");
echo json_encode($result);
exit();

?>