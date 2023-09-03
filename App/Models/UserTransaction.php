<?php

namespace App\Models;

use DateTime;
use \App\Utils;


abstract class UserTransaction extends \Core\Model {
    protected $userID;

    protected $amount;
    protected $date;
    protected $comment;
    protected $transactionID;

    protected $errors = [];
    protected $errorMsg;

    public function __construct($userID, $data = []) {
        $this->userID = $userID;

        foreach($data as $key => $value) {
            $camelCaseKey = Utils::convertToCamelCase($key);
            $this->$camelCaseKey = $value;
        };
    }

    public function getErrorMsg() {
        return $this->errorMsg;
    }

    protected function validateAmount() {
        if (filter_var($this->amount, FILTER_VALIDATE_FLOAT) == false) {
            $this->errors["Amount"] = "Cash amount not a number.";
        }
    }

    protected function validateDate() {
        $format = "Y-m-d";
        $d = DateTime::createFromFormat($format, $this->date);
        if (!($d && $d->format($format) === $this->date)) {
            $this->errors["Date"] = "Wrong format.";
        }
    }

    protected function validateComment() {
        if ($this->comment == "") {
            return;
        }
        if (filter_var($this->comment, FILTER_SANITIZE_FULL_SPECIAL_CHARS) == false) {
            $this->errors['Comment'] = 'Not a string.';
        }
    }

    protected function validateTransactionID() {
        if (filter_var($this->transactionID, FILTER_VALIDATE_INT) == false) {
            $this->errors["Transaction ID"] = "Not an integer.";
        }
    }

    protected function checkValidate() {
        if (count($this->errors) == 0) {
            $this->errors = [];
            return true;
        }

        $errorMsg = "";
        foreach($this->errors as $key => $value) {
            $errorMsg .= "{$key}: {$value} \n";
        };
        $this->errorMsg = $errorMsg;

        $this->errors = [];
        return false;
    }
}