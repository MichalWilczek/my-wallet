<?php 

namespace App\Controllers\Super;

use \App\Auth;
use \App\Response;
use \App\Models\TransactionCategory;


abstract class Category extends Authenticated {
    protected $tableDataObj;

    public function getAction() {
        $userID = Auth::getUserID();

        $tableData = new $this->tableDataObj();
        $category = new TransactionCategory($userID, $tableData->tableName);
        $response = $category->get();

        if ($response || count($response) == 0) {
            http_response_code(200);
            Response::success($response);
        } else {
            http_response_code(404);
            Response::error("Not found");
        }
    }

    public function addAction() {
        $userID = Auth::getUserID();

        $tableData = new $this->tableDataObj();
        $category = new TransactionCategory($userID, $tableData->tableName);
        $response = $category->add();

        if ($response) {
            http_response_code(201);
            Response::success([]);
        } else {
            http_response_code(404);
            Response::error("Not found");
        }
    }

    public function deleteAction() {
        $userID = Auth::getUserID();

        $tableData = new $this->tableDataObj();
        $_POST['categoryID'] = $this->route_params['id'];
        $category = new TransactionCategory($userID, $tableData->tableName, $_POST);
        $response = $category->delete();

        if ($response) {
            http_response_code(200);
            Response::success([]);
        } else {
            http_response_code(404);
            Response::error("Not found");
        }
    }

    public function modifyAction() {
        $userID = Auth::getUserID();

        $tableData = new $this->tableDataObj();
        $_POST['categoryID'] = $this->route_params['id'];
        $category = new TransactionCategory($userID, $tableData->tableName, $_POST);
        $response = $category->modify();

        if ($response) {
            http_response_code(200);
            Response::success([]);
        } else {
            http_response_code(404);
            Response::error("Not found");
        }
    }
}