<?php
class UserData {
	public $successful;
	public $errors = [];
	public $id;
	public $userName;
	public $userData = [];

	function __construct(
		$loginSuccessful, 
		$userID = null, 
		$userName = null,
		$userData = []
	) {
		$this->successful = $loginSuccessful;
		$this->id = $userID;
		$this->userName = $userName;
		$this->userData = $userData;
	}
}

function getUserData($dbConnect, $userID) {
	$userData = [];
	$userData['incomes'] = getIncomeData($dbConnect, $userID);
	$userData['expenses'] = getExpenseData($dbConnect, $userID);
	return $userData;
}

function getIncomeData($dbConnect, $userID) {
	$incomeData = [];
	$incomeData["incomeOptions"] = getTransactionOptionsForUser($dbConnect, $userID, "incomeTables");
	return $incomeData;
}

function getExpenseData($dbConnect, $userID) {
	$expenseData = [];
	$expenseData["expenseOptions"] = getTransactionOptionsForUser($dbConnect, $userID, "expenseTables");
	$expenseData["paymentOptions"] = getTransactionOptionsForUser($dbConnect, $userID, "paymentTables");
	return $expenseData;
}

?>