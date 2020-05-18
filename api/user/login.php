<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ ."/../class/Response.php");
require_once(__DIR__ ."/../class/Request.php");
require_once(__DIR__ ."/../class/User.php");

$method = (!empty($_SERVER["REQUEST_METHOD"]))? $_SERVER["REQUEST_METHOD"]: "GET";

if ($method === "POST") {
    $req = Request::parse();
    
    $user = new User();
    if (($val = $user->login($req->username, $req->password)) !== false) {
        session_start();
        $_SESSION["username"] = $req->username;
        Response::send(null, 200, "Logged in");
    }
    Response::send(null, 401, "Check your username/password.");
} else {
    Response::not_found();
}

