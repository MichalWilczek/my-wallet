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

function handleDates($dateFrom=null, $dateTo=null) {
	$dates = [];

	// Set first day of the current month
	if (is_null($dateFrom) || $dateFrom == "") {
		$dates["from"] = date("Y-m")."-01";
	} else {
		$dates["from"] = $dateFrom;
	}

	// Set current day
	if (is_null($dateTo) || $dateTo == "") {
		$dates["to"] = date("Y-m-d");
	} else {
		$dates["to"] = $dateTo;
	}

	return $dates;
}

function getUserData($dbConnect, $userID, $dateFrom=null, $dateTo=null) {
	$dates = handleDates($dateFrom, $dateTo);
	$userData = [];
	$userData['dates'] = [
		'from' => $dates["from"],
		'to' => $dates["to"]
	];
	$userData['incomeData'] = getIncomeData($dbConnect, $userID, $dates["from"], $dates["to"]);
	$userData['expenseData'] = getExpenseData($dbConnect, $userID, $dates["from"], $dates["to"]);
	return $userData;
}

function getIncomeData($dbConnect, $userID, $dateFrom, $dateTo) {
	$incomeData = [];
	$incomeData["incomeOptions"] = getTransactionOptionsForUser($dbConnect, $userID, "incomeTables");
	$incomeData["incomes"] = getUserIncomeTransactions($dbConnect, $userID, $dateFrom, $dateTo);
	return $incomeData;
}

function getExpenseData($dbConnect, $userID, $dateFrom, $dateTo) {
	$expenseData = [];
	$expenseData["expenseOptions"] = getTransactionOptionsForUser($dbConnect, $userID, "expenseTables");
	$expenseData["paymentOptions"] = getTransactionOptionsForUser($dbConnect, $userID, "paymentTables");
	$expenseData["expenses"] = getUserExpenseTransactions($dbConnect, $userID, $dateFrom, $dateTo);
	return $expenseData;
}

?>