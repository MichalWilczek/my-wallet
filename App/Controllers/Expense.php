<?php

namespace App\Controllers;


class Expense extends \App\Controllers\Super\Transaction {
    protected $userModelName = "\App\Models\UserExpense";
}