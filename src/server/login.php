<?php
require_once("db.php");

class LoginData {
	public $loginSuccessful;
	public $id;
	public $userName;
	public $userData = [];

	function __construct($loginSuccessful, $userID = null, $userName = null) {
		$this->loginSuccessful = $loginSuccessful;
		$this->id = $userID;
		$this->userName = $userName;
	}
}

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
			return new LoginData(
				true, 
				$userData['id'], 
				$userData['username']
			);
		} else {
			return new LoginData(false);
		}
	} catch (Exception $error) {
		$errors["db_connection"] = "Server error! Apologies for inconvenience. Please, register at another time.";
	}
}

session_start();
if (isset($_POST["username"]) && isset($_POST["password"])) {
	$loginData = loginToAccount();
} else {
	$loginData = new LoginData(false);
}
$apiResult = (array) $loginData;
header("Content-Type: application/json");
echo json_encode($apiResult);
exit();

?>