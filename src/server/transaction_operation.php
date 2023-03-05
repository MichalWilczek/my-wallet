<?php
require_once("transaction_operators.php");


function factoryTransactionOperations() {

    // Check if POST messages are not set and throw an error.
    if (!isset($_POST["transaction_type"]) || !isset($_POST["procedure"])) {
        throw new Exception("Elements 'transaction_type' and 'procedure' must be included in the query.");
    }

    if ($_POST["procedure"] == "add" && $_POST["transaction_type"] == "income") {
        return new IncomeTransactionAddition();
    }
    if ($_POST["procedure"] == "add" && $_POST["transaction_type"] == "expense") {
        return new ExpenseTransactionAddition();
    }
    if ($_POST["procedure"] == "delete" && $_POST["transaction_type"] == "income") {
        return new IncomeTransactionDeletion();
    }
    if ($_POST["procedure"] == "delete" && $_POST["transaction_type"] == "expense") {
        return new ExpenseTransactionDeletion();
    }
    if ($_POST["procedure"] == "modify" && $_POST["transaction_type"] == "income") {
        return new IncomeTransactionModification();
    }
    if ($_POST["procedure"] == "modify" && $_POST["transaction_type"] == "expense") {
        return new ExpenseTransactionModification();
    }

    // All other cases should throw an exception.
    throw new Exception("procedure: ${$_POST['procedure']}, transaction_type: {$_POST['transaction_type']} do not correspond to acceptable values.");
}

function runTransaction($userID) {
    $operator = factoryTransactionOperations();
    $errors = $operator->validateInput();
    
    if (count($errors) == 0) {
        $dbConnect = connectToDB();
        $errors = $operator->runOperationInDb($dbConnect, $userID);
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
        $result = runTransaction($_SESSION["userID"]);
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