<?php
function generateErrorMessage($session_error_key, $error_message) {
	session_start();
	if (isset($_POST[$session_error_key])) {
		echo $error_message;
		unset($_POST[$session_error_key]);
	}
}
?>