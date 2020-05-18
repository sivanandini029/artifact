<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ ."/class/Response.php");

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    Response::send(null, 200, "Hello World!");
}