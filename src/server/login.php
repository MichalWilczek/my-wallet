<?php
require_once("db.php");

class LoginData {
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

// function getUserData() {
// 	$userData = [];
// 	// $userData['incomes'] = getIncomeData();
// 	// $userData['expenses'] = getExpenseData();
// 	return $userData;
// }

// function getIncomeData() {

// }

// function getExpenseData() {

// }

function loginToAccount() {

	$username = filter_input(INPUT_POST, 'username');
	$password = filter_input(INPUT_POST, 'password');
	try {
		$dbConnect = connectToDB();
		$userQuery = $dbConnect->prepare('SELECT id, password FROM users WHERE username = :username');
		$userQuery->bindValue(':username', $username, PDO::PARAM_STR);
		$userQuery->execute();
		$userData = $userQuery->fetch();

		if ($userData && password_verify($password, $userData['password'])) {
			$_SESSION["logged_in"] = true;
			$_SESSION["user_id"] = $userData['id'];
			$tempLoginData = new LoginData(
				true, 
				$userData['id'], 
				$username,
				// getUserData()
			);
			return $tempLoginData;
		} else {
			$tempLoginData = new LoginData(false);
			$tempLoginData->errors["login_attempt"] = "Username or password are incorrect.";
			return $tempLoginData;
		}
	} catch (Exception $error) {
		$tempLoginData = new LoginData(false);
		$tempLoginData->errors["db_connection"] = "Server error! Apologies for inconvenience. Please, register at another time.";
		return $tempLoginData;
	}
}

session_start();
if (isset($_POST["username"]) && isset($_POST["password"])) {
	$loginData = loginToAccount();
} else {
	$loginData = new LoginData(false);
	$loginData->errors["unknown_error"] = "Unexpexted error ocurred. ";
}
$apiResult = (array) $loginData;
header("Content-Type: application/json");
echo json_encode($apiResult);
exit();

?>