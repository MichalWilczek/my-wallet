<?php 

namespace App\Controllers\Super;


abstract class Authenticated extends \Core\Controller {
    protected function before() {
        $this->requireLogin();
    }
}