<?php
session_start();
unset($_SESSION["userID"]);
unset($_SESSION["loggedInUsername"]);
header("Location: /my-wallet/src/index.php");
?>