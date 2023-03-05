<?php
require_once("db.php");
require_once("user_data.php");
// require_once("transactions.php");
require_once("transaction_operators.php");

function getTransactionOperatorforSaving() {
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

function addTransaction ($userID) {
    $transactionOperator = getTransactionOperatorforSaving();
    $errors = $transactionOperator->validateInputForAddingTransaction();
    
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
if (isset($_SESSION["userID"]) && isset($_SESSION["loggedInUsername"])) {
    try {
        $result = addTransaction($_SESSION["userID"]);
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