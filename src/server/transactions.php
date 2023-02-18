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

?>