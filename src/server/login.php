<?php
require_once("db.php");

class LoginData {
	public $loginSuccessful;
	public $id;
	public $userName;

	function __construct($loginSuccessful = false, $userID = null, $userName = null) {
		$this->loginSuccessful = $loginSuccessful;
		$this->id = $userID;
		$this->userName = $userName;
	}
}

function loginToAccount() {
	session_start();
	
    if (!isset($_POST["username"]) || !isset($_POST["password"])) {
        header("Location: index.php");
        return new LoginData();
    }

	if (isset($_POST['username'])) {
		// Get required POST input
		$username = filter_input(INPUT_POST, 'username');
		$password = filter_input(INPUT_POST, 'password');

		// Query credentials from the database
		$dbConnect = connectToDB();
		$userQuery = $dbConnect->prepare('SELECT id, password FROM users WHERE username = :username');
		$userQuery->bindValue(':username', $username, PDO::PARAM_STR);
		$userQuery->execute();
		$userData = $userQuery->fetch();

		// Verify connection and password
		if ($userData && password_verify($password, $userData['password'])) {
			return new LoginData(true, $userData['id'], $userData['username']);
		} else {
			header('Location: welcome.php');
			return new LoginData();
		}
	} 
}

function generateErrorMessage($session_error_key, $error_message) {
	session_start();
	if (isset($_POST[$session_error_key])) {
		echo $error_message;
		unset($_POST[$session_error_key]);
	}
}
?>