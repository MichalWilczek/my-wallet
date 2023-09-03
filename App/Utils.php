<?php

namespace App;


class Utils {

    public static function convertToCamelCase($inputString) {
        $parts = explode('-', $inputString);
        
        if (count($parts) > 1) {
            for ($i = 1; $i < count($parts); $i++) {
                $parts[$i] = ucfirst($parts[$i]);
            }
        }
        
        return implode('', $parts);
    }

    public static function handleDates($data) {
        if (array_key_exists("dateFrom", $data) && Utils::validateDate($data["dateFrom"])) {
            $dates["from"] = $data["dateFrom"];
        } else {
            $dates["from"] = date("Y-m")."-01";
        }

        if (array_key_exists("dateTo", $data) && Utils::validateDate($data["dateTo"])) {
            $dates["to"] = $data["dateTo"];
        } else {
            $dates["to"] = date("Y-m-d");
        }
    
        return $dates;
    }

    protected static function validateDate($date) {
        if (preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/",$date)) {
            return true;
        } else {
            return false;
        }
    }

}
