<?php 

namespace App\Controllers\Super;

use \App\Auth;
use \App\Response;
use \App\Utils;


abstract class Transaction extends Authenticated {
    protected $userModelName;

    public function getAction() {
        $userID = Auth::getUserID();
        $transaction = new $this->userModelName($userID);
        $dates = Utils::handleDates($_GET);
        $response = $transaction->get($dates['from'], $dates['to']);

        if ($response || count($response) == 0) {
            http_response_code(200);
            Response::success($response);
        } else {
            http_response_code(404);
            Response::error($this->parseErrorMsg($transaction->getErrorMsg()));
        }
    }

    public function add() {
        $userID = Auth::getUserID();
        $transaction = new $this->userModelName($userID, $_POST);
        $response = $transaction->add();

        if ($response) {
            http_response_code(201);
            Response::success([]);
        } else {
            http_response_code(404);
            Response::error($this->parseErrorMsg($transaction->getErrorMsg()));
        }
    }

    public function delete() {
        $userID = Auth::getUserID();
        $_POST['transactionID'] = $this->route_params['id'];
        $transaction = new $this->userModelName($userID, $_POST);
        $response = $transaction->delete();

        if ($response) {
            http_response_code(200);
            Response::success([]);
        } else {
            http_response_code(404);
            Response::error($this->parseErrorMsg($transaction->getErrorMsg()));
        }
    }

    public function modify() {
        $userID = Auth::getUserID();
        $_POST['transactionID'] = $this->route_params['id'];
        $transaction = new $this->userModelName($userID, $_POST);
        $response = $transaction->modify();

        if ($response) {
            http_response_code(200);
            Response::success([]);
        } else {
            http_response_code(404);
            Response::error($this->parseErrorMsg($transaction->getErrorMsg()));
        }
    }

    protected function parseErrorMsg($errorMsg=null) {
        if (is_null($errorMsg)) {
            return "Not found";
        }
        return $errorMsg;
    }
}