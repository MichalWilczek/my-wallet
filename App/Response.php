<?php

namespace App;


class Response {

    public static function success($resource, $msg="") {
        $response = array(
            'status' => 'success',
            'data' => [
                'message' => $msg,
                'resource' => $resource
            ]
        );
        header('Content-Type: application/json');
        echo json_encode($response);
    }

    public static function error($msg) {
        $response = array(
            'status' => 'error',
            'errorMessage' => $msg
        );
        header('Content-Type: application/json');
        echo json_encode($response);
    }
}
