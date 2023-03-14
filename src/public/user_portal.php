<?php
session_start();
if (!isset($_SESSION["userID"]) && !isset($_SESSION["loggedInUsername"])) {
    header("Location: index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Budget</title>

        <!-- Bootstrap CSS file. -->
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
            crossorigin="anonymous" />
        <!-- CSS file with fonts. -->
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        <!-- Custom CSS file. -->
        <link 
            rel="stylesheet" 
            href="css/app.css" />
    </head>
    <body
        onload="runUserPortal();">
        <nav class="navbar navbar-expand-md sticky-top p-1" id="upper_nav_bar">
            <div class="container-fluid">
                <a class="navbar-brand" href="user_portal.php">
                    <img src="img/logo-1.png" alt="Your Budget" height="50" />
                    <img src="img/logo-2.png" alt="Your Budget" height="50" />
                    <img
                        src="img/logo-3.png"
                        class="logo_text"
                        alt="Your Budget"
                        height="50" />
                </a>
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    <!-- <span class="navbar-toggler-icon glyphicon glyphicon-menu-hamburger"></span> -->
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                        <a
                            class="nav-link"
                            data-bs-toggle="collapse" 
                            data-bs-target=".navbar-collapse.show"
                            aria-current="page"
                            onclick="runUserPortal();"
                            >Home</a
                        >
                        <a
                            class="nav-link"
                            data-bs-toggle="collapse" 
                            data-bs-target=".navbar-collapse.show"
                            onclick="addIncome('main_page_content');"
                            >Add Income</a
                        >
                        <a
                            class="nav-link"
                            data-bs-toggle="collapse" 
                            data-bs-target=".navbar-collapse.show"
                            onclick="addExpense('main_page_content');"
                            >Add Expense</a
                        >
                        <a
                            class="nav-link"
                            data-bs-toggle="collapse" 
                            data-bs-target=".navbar-collapse.show"
                            onclick="changeSettings('main_page_content');"
                            >Settings</a
                        >
                    </div>
                    <div id="logOutDiv">
                        <span id="upper_nav_bar_span_id">Hello world</span>
                        <button
                            id="logOutButton"
                            class="log_button"
                            onclick="logOut('logOutButton');">
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container">
            <main id="main_page_content"></main>
        </div>

        <footer>
            <nav class="navbar">
                <div class="container-fluid">
                  <a class="nav-link p-2" href="#">About me</a>
                </div>
              </nav>
        </footer>

        <!-- Bootstrap scripts -->
        <script
            src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
            integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3"
            crossorigin="anonymous"></script>
        <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.min.js"
            integrity="sha384-IDwe1+LCz02ROU9k972gdyvl+AESN10+x7tBKgc9I5HFtuNz0wWnPclzo6p9vxnk"
            crossorigin="anonymous"></script>

        <!-- ReCaptcha script -->
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
        <!-- Axios script -->
        <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
        <!-- Plotly script -->
        <script src="https://cdn.plot.ly/plotly-2.18.2.min.js"></script>

        <!-- Custom scripts -->
        <script type="module" src="js/globals.js"></script>
        <script type="module" src="js/api.js"></script>
        <script type="module" src="js/balance.js"></script>
        <script type="module" src="js/index.js"></script>
        <script type="module" src="js/modal.js"></script>
        <script type="module" src="js/period_options.js"></script>
        <script type="module" src="js/transaction_operators.js"></script>
        <script type="module" src="js/user_data.js"></script>
        <script type="module" src="js/user_options.js"></script>
        <script type="module" src="js/utils.js"></script>
        
    </body>
</html>
