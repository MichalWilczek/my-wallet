<?php
session_start();
unset($_SESSION["userData"]);
header("Location: /my-wallet/src/index.php");
?>