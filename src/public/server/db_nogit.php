<?php

function getConfigDB() {
    return [
        "host" => "budget.michal-wilczek.profesjonalnyprogramista.pl.mysql.dhosting.pl",
        "user" => "eew4he_budgetmi",
        "password" => "ro4Aewah0lee",
        "database" => "maik4e_budgetmi"
    ];
}

function connectToDB($config=null) {

    // Get config data
    if (is_null($config)) {
        $config = getConfigDB();
    } else {
        throw new Exception("DB configuration is not set!");
    }

    // Connect to the database
    try {
        $db = new PDO(
            "mysql:host={$config['host']}; dbname={$config['database']}; charset=utf8",
            $config["user"],
            $config["password"],
            [
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]
        );
        return $db;
    } catch (PDOException $error) {
        exit("Database error: " . $error->getMessage());
    }
}

?>