<?php
// TO MAKE THE PROGRAM WORK, CHANGE THE FILE NAME TO 'Config.php' and set up your own configuration

namespace App;


class ConfigExample
{
    const DB_HOST = 'localhost';
    const DB_NAME = 'mywallet';
    const DB_USER = 'root';
    const DB_PASSWORD = '';
    const SHOW_ERRORS = true;
    const HASH_SECRET_KEY = 'mysecrethash';

    const MAIL_USERNAME = 'email@example.com';
    const MAIL_PASSWORD = 'passwordtomailserver';
}
