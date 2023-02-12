<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Budget</title>
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
            crossorigin="anonymous" />
        <link rel="stylesheet" href="css/app.css" />
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        <style>
            @import url("https://fonts.googleapis.com/css2?family=Arapey&display=swap");
        </style>
        <style>
            @import url("https://fonts.googleapis.com/css2?family=Arapey:ital@0;1&display=swap");
        </style>
    </head>
    <body>
        <nav class="navbar p-1" id="upper_nav_bar">
            <div class="container-fluid">
                <a class="navbar-brand" href="welcome.html">
                    <img src="img/logo-1.png" alt="Your Budget" height="50" />
                    <img src="img/logo-2.png" alt="Your Budget" height="50" />
                    <img src="img/logo-3.png" class="logo_text" alt="Your Budget" height="50" />
                </a>

                <button
                    class="log_button"
                    id="loginButtonID"
                    onclick="logIn('main_page_content_login', 'loginButtonID');"
                    type="button">
                    Login
                </button>
            </div>
        </nav>

        <div class="container">
            <main id="main_page_content_login">
                <div class="row text-center">
                    <img
                        class="img-fluid col-9 col-lg-7 col-xxl-5 mx-auto d-block mt-3"
                        src="img/background-photo.jpg"
                        alt="Background photo for quote" />
                </div>

                <h2>
                    “A budget is more than just a series of numbers on a page;
                    <br />
                    it is an embodiment of our values.”
                </h2>
            </main>
        </div>

        <footer>
            <nav class="navbar">
                <div class="container-fluid">
                  <a class="nav-link p-2" href="#">About me</a>
                </div>
              </nav>
        </footer>

        <!-- External JS add-ons -->
        <script
            src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
            integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3"
            crossorigin="anonymous"></script>
        <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.min.js"
            integrity="sha384-IDwe1+LCz02ROU9k972gdyvl+AESN10+x7tBKgc9I5HFtuNz0wWnPclzo6p9vxnk"
            crossorigin="anonymous"></script>
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>

        <!-- Internally developed JS scripts -->
        <script type="text/javascript">
            <?php 
            if (isset($_SESSION["registration_errors"])) {
                $regErrors = $_SESSION["registration_errors"];
                if (array_key_exists("username", $regErrors)) {
                    $username = $regErrors["username"];
                }
                if (array_key_exists("email", $regErrors)) {
                    $email = $regErrors["email"];
                }
                if (array_key_exists("password", $regErrors)) {
                    $password = $regErrors["password"];
                }
                if (array_key_exists("bot", $regErrors)) {
                    $bot = $regErrors["bot"];
                }
            }
            ?>
            const regErrorUsername = <?php echo $username ?>;
            const regErrorEmail = <?php echo $email ?>;
            const regErrorPassword = <?php echo $password ?>;
            const regErrorBot = <?php echo $bot ?>;
        </script>

        <script src="js/index.js"></script>

    </body>
</html>
