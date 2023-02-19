<?php

function getCategoryTypeData($categoryType) {
    $data = [];
    switch ($categoryType) {
        case "incomeTables":
            $data["defaultTableName"] = "incomes_category_default";
            $data["userTableName"] = "incomes_category_assigned_to_users";
            break;
        case "expenseTables":
            $data["defaultTableName"] = "expenses_category_default";
            $data["userTableName"] = "expenses_category_assigned_to_users";
            break;
        case "paymentTables":
            $data["defaultTableName"] = "payment_methods_default";
            $data["userTableName"] = "payment_methods_assigned_to_users";
            break;
        default: 
            throw new Exception("The option: ".$categoryType." does not exist.");
    }
    return $data;
}
function createDefaultTransactionCategories($dbConnect, $userID, $categoryType) {

    $tableData = getCategoryTypeData($categoryType);
    $defaultTable = $tableData['defaultTableName'];
    $userTable = $tableData['userTableName'];

    try {
        $query1 = $dbConnect->prepare("SELECT id, name FROM $defaultTable");
        $query1->execute();
        $defaultCategories = $query1->fetchAll();;
        if (!empty($defaultCategories)) {
            foreach ($defaultCategories as $category) {
                $query2 = $dbConnect->prepare("INSERT INTO $userTable VALUES (NULL, :user_id, :name)");
                $query2->bindValue(":user_id", $userID, PDO::PARAM_INT);
                $query2->bindValue(":name", $category["name"], PDO::PARAM_STR);
                $query2->execute();
            }
        }
    } catch (Exception $error) {
        echo "Server error while creating default user categories";
    }
}

function getTransactionOptionsForUser($dbConnect, $userID, $categoryType) {
    
    $tableData = getCategoryTypeData($categoryType);
    $userTable = $tableData['userTableName'];

    try {
        $query = $dbConnect->prepare("SELECT name FROM $userTable WHERE user_id = :user_id");
        $query->bindValue(":user_id", $userID, PDO::PARAM_INT);
        $query->execute();
        $categories = $query->fetchAll();
        
        $results = [];
        foreach($categories as $category) {
            array_push($results, $category["name"]);
        }
        return $results;
        
    } catch (Exception $error) {
        echo "Server error while getting transaction options for the user";
    }
}

function modifyTransactionOptionsForUser($dbConnect, $userID, $categoryType, $oldCategoryName, $newCategoryName=null) {
    
    $tableData = getCategoryTypeData($categoryType);
    $userTable = $tableData['userTableName'];

    try {
        if (is_null($newCategoryName)) {
            $query = $dbConnect->prepare("DELETE FROM $userTable WHERE user_id = :user_id AND name = :old_name");
        } else {
            $query = $dbConnect->prepare("UPDATE $userTable SET name = :name WHERE user_id = :user_id AND name = :old_name");
            $query->bindValue(":name", $newCategoryName, PDO::PARAM_STR);
        }
        $query->bindValue(":user_id", $userID, PDO::PARAM_INT);
        $query->bindValue(":old_name", $oldCategoryName, PDO::PARAM_STR);
        $query->execute();
        $categories = $query->fetchAll();
        
        $results = [];
        foreach($categories as $category) {
            array_push($results, $category["name"]);
        }
        return $results;
        
    } catch (Exception $error) {
        echo "Server error while modifying transaction options for the user";
    }
}

?>