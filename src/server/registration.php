<?php
require_once("db.php");

function checkUserNameInput($username) {
    $errors = [];
    if (strlen($username) < 3 || strlen($username) > 30) {
        $errors["username"] = "The user name must contain 3-30 signs.";
    }
    if (ctype_alnum($username) == false) {
        $errors["username"] = "User name must only contain alphanumeric elements.";
    }
    return $errors;
}

function checkEmailInput($email) {
    $errors = [];
    $sanitised_email = filter_var($email, FILTER_SANITIZE_EMAIL);
    if (filter_var($sanitised_email, FILTER_VALIDATE_EMAIL) == false || $email != $sanitised_email) {
        $errors["email"] = "Your email must only contain acceptable letters.";
    }
    return $errors;
}

function checkPasswordInput($password1, $password2) {
    $errors = [];
    if (strlen($password1) < 8 || strlen($password1) > 30) {
        $errors["password"] = "Password must contain 8 - 30 signs.";
    }
    if ($password1 != $password2) {
        $errors["password"] = "The given passwords are not identical.";
    }
    return $errors;
}

function checkReCaptcha($secret, $recaptchaResonse) {
    $errors = [];
    $captcha_check = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=" . $secret . "&response=" . $recaptchaResonse);
    $answer = json_decode($captcha_check);
    if ($answer->success == false) {
        $errors["bot"] = "Confirm you are not a bot.";
    }
    return $errors;
}

function registerAccount() {
    $errors = [];

    $username = filter_input(INPUT_POST, "username");
    $email = filter_input(INPUT_POST, "email");
    $password = filter_input(INPUT_POST, "password1");

    $errors = array_merge($errors, checkUserNameInput($username));
    $errors = array_merge($errors, checkEmailInput($email));
    $errors = array_merge($errors, checkPasswordInput($password, filter_input(INPUT_POST, "password2")));
    
    try {
        $dbConnect = connectToDB();

        // Check if the user name exists in the database
        $query1 = $dbConnect->prepare("SELECT id FROM users WHERE username = :username");
        $query1->bindValue(":username", $username, PDO::PARAM_STR);
        $query1->execute();
        $existingID = $query1->fetch();
        if (!empty($existingID)) {
            $errors["username"] = "The given user name already exists in the database.";
            return $errors;
        }

        // Check if the email already exists in the database
        $query2 = $dbConnect->prepare("SELECT id FROM users WHERE email = :email");
        $query2->bindValue(":email", $email, PDO::PARAM_STR);
        $query2->execute();
        $existingID = $query2->fetch();
        if (!empty($existingID)) {
            $errors["email"] = "The given email already exists in the database.";
            return $errors;
        }

        // Insert the accepted user to the database
        $query3 = $dbConnect->prepare("INSERT INTO users VALUES (NULL, :username, :password, :email)");
        $query3->bindValue(":username", $username, PDO::PARAM_STR);
        $query3->bindValue(":password", password_hash($password, PASSWORD_DEFAULT), PDO::PARAM_STR);
        $query3->bindValue(":email", $email, PDO::PARAM_STR);
        $query3->execute();
        return $errors;

    } catch (Exception $error) {
        $errors["db_connection"] = "Server error! Apologies for inconvenience. Please, register at another time.";
    }
}

session_start();
$apiResult = array();
if (isset($_POST["username"]) && isset($_POST["email"]) && isset($_POST["password1"]) && isset($_POST["password2"])) {

    $errors = registerAccount();
    if (count($errors) == 0) {
        $apiResult["successful"] = true;
        $apiResult["errors"] = [];
    } else {
        $apiResult["successful"] = false;
        $apiResult["errors"] = $errors;
    }
} else {
    $apiResult["successful"] = false;
    $apiResult["errors"] = [];
}
header("Content-Type: application/json");
echo json_encode($apiResult);
exit();

?>
