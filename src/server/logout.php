<?php
session_start();
// unset($_SESSION["logged_in"]);
// unset($_SESSION["user_id"]);
unset($_SESSION["userData"]);
header("Location: /my-wallet/src/index.php");
?>