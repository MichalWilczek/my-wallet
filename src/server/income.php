<?php
require_once("db.php");

interface CashFlowAnalyser
{
    public function checkInputErrors();
    public function getQuery();
}

class IncomeData {
    public $userID;
    public $category;
    public $amount;
    public $issueDate;
    public $comment;
}

class ExpenseData extends IncomeData {
    public $paymentMethodID;
}


class IncomeAnalyser implements CashFlowAnalyser {
	protected $amount;
    protected $date;
    protected $cashFlowOption;
    private $cashFlowOptionName = "income";
    protected $inputErrors = [];

	function __construct() {
		$this->amount = filter_input(INPUT_POST, "amount");;
		$this->date = filter_input(INPUT_POST, "date");;
		$this->cashFlowOption = filter_input(INPUT_POST, `{$this->cashFlowOptionName}_option`);;
	}

    function checkInputErrors() {
        $this->checkAmount();
        $this->checkDate();
        $this->checkCashFlowOption();
        return $this->inputErrors;
    }

    function checkAmount() {
        if (filter_var($this->amount, FILTER_VALIDATE_FLOAT) == false) {
            $this->inputErrors["amount"] = "The input cash amount must be a number.";
        }
    }

    function checkDate() {

        // ADD A CHECK FOR DATE!!!
        // $current_date = new DateTime("2021-05-01 14:59:12"); // UTC time ;-)
        // $user_premium_days_left = DateTime::createFromFormat("Y-m-d H:i:s", $_SESSION["premiumdays"]);
    }

    function checkCashFlowOption() {
        if (filter_var($this->cashFlowOption, FILTER_SANITIZE_STRING) == false) {
            $this->inputErrors[`${$this->cashFlowOptionName}_option`] = `The ${$this->cashFlowOptionName} option must be a string.`;
        }
    }

    function getQuery() {
        // VALUES (NULL, :username, :password, :email)
        return "INSERT INTO incomes VALUES (NULL, :user_id, :income_category_assigned_to_user, :amount, :date_of_income, :income_comment)";
    }
}

class ExpenseAnalyser extends IncomeAnalyser {

    private $cashFlowOptionName = "expense";
    protected $paymentOption;
    function __construct() {
        parent::__construct();
		$this->paymentOption = filter_input(INPUT_POST, "payment_option");;
	}

    function checkInputErrors() {
        parent::checkInputErrors();
        $this->checkPaymentOption();
        return $this->inputErrors;
    }

    function checkPaymentOption() {
        if (filter_var($this->paymentOption, FILTER_SANITIZE_STRING) == false) {
            $this->inputErrors["payment_option"] = "The payment option must be a string.";
        }
    }

    function getQuery() {
        // VALUES (NULL, :username, :password, :email)
        return "INSERT INTO incomes VALUES (NULL, )";
    }
}

class CashFlowInsertion {

    private $cashFlowAnalyser;

    function __construct($cashflowAnalyser) {
        $this->$cashflowAnalyser;
    }
}




function addIncome() {
    $errors = [];

    $amount = filter_input(INPUT_POST, "amount");
    $date = filter_input(INPUT_POST, "date");
    $incomeOption = filter_input(INPUT_POST, "income_option");

    $errors = array_merge($amount, checkUserNameInput($username));
    $errors = array_merge($errors, checkEmailInput($email));
    $errors = array_merge($errors, checkPasswordInput($password, filter_input(INPUT_POST, "password2")));
    
    try {
        $dbConnect = connectToDB();

        // Insert the accepted user to the database
        $query3 = $dbConnect->prepare("INSERT INTO users VALUES (NULL, :username, :password, :email)");
        $query3->bindValue(":username", $username, PDO::PARAM_STR);
        $query3->bindValue(":password", password_hash($password, PASSWORD_DEFAULT), PDO::PARAM_STR);
        $query3->bindValue(":email", $email, PDO::PARAM_STR);
        $query3->execute();
        return $errors;

    } catch (Exception $error) {
        $errors["db_connection"] = "Server error! Apologies for inconvenience. Please, register at another time.";
    }
}

session_start();
$apiResult = array();

if (isset($_POST["amount"]) && isset($_POST["date"]) && isset($_POST["income_option"])) {

} else {

}

header("Content-Type: application/json");
echo json_encode($apiResult);
exit();

?>
