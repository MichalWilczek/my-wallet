<?php
require_once("db.php");
require_once("user_data.php");
require_once("transactions.php");


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
			echo "Hello World! \n \n";
			$tempLoginData = new UserData(
				true, 
				$userData['id'], 
				$username,
				getUserData($dbConnect, $userData['id'])
			);
			$_SESSION["userID"] = $userData['id'];
			$_SESSION["loggedInUsername"] = $username;
			return $tempLoginData;
		} else {
			$tempLoginData = new UserData(false);
			$tempLoginData->errors["login_attempt"] = "Username or password are incorrect.";
			return $tempLoginData;
		}
	} catch (Exception $error) {
		$tempLoginData = new UserData(false);
		$tempLoginData->errors["db_connection"] = "Server error! Apologies for inconvenience. Please, register at another time.";
		return $tempLoginData;
	}
}

session_start();

if (isset($_SESSION["userID"]) && isset($_SESSION["loggedInUsername"])) {
	if (isset($_POST["dateFrom"])) {
		$dateFrom = filter_input(INPUT_POST, "dateFrom");
	} else {
		$dateFrom = null;
	}
	if (isset($_POST["dateTo"])) {
		$dateTo = filter_input(INPUT_POST, "dateTo");
	} else {
		$dateTo = null;
	}

	try {
		$dbConnect = connectToDB();
		$userData = getUserData($dbConnect, $_SESSION["userID"], $dateFrom, $dateTo);
		$sessionUserData = new UserData(
			true, 
			$_SESSION["userID"], 
			$_SESSION["loggedInUsername"],
			$userData
		);
	} catch (Exception $error) {
		$sessionUserData = new UserData(false);
		$sessionUserData->errors["unknown_error"] = "Unexpexted error ocurred. ";
	}
	$apiResult = (array) $sessionUserData;

} else {
	if (isset($_POST["username"]) && isset($_POST["password"])) {
		$loginData = loginToAccount();
	} else {
		$loginData = new UserData(false);
		$loginData->errors["unknown_error"] = "Unexpexted error ocurred. ";
	}
	$apiResult = (array) $loginData;
}
header("Content-Type: application/json");
echo json_encode($apiResult);
exit();

?>