<?php
require_once("db.php");
require_once("user_data.php");
require_once("transaction_operators.php");

function getTransactionOperatorForDeleting() {
    if (isset($_POST["income"])) {
        return new IncomeOperator();
    }
    if (isset($_POST["expense"])) {
        return new ExpenseOperator();
    }
    throw new Exception("Object for transaction data cannot be set due to missing post input data.");
}

function deleteTransaction ($userID, $transactionID) {
    $transactionOperator = getTransactionOperatorForDeleting();

    $dbConnect = connectToDB();
    $errors = $transactionOperator->deleteTransactionInDB($dbConnect, $userID, $transactionID);
}


?>