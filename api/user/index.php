<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ ."/../class/Response.php");
require_once(__DIR__ ."/../class/Request.php");
require_once(__DIR__ ."/../class/User.php");

session_start();
$method = (!empty($_SERVER["REQUEST_METHOD"]))? $_SERVER["REQUEST_METHOD"]: "GET";

if ($method === "POST" && empty($_SESSION["username"])) {
    $req = Request::parse();
    

    $user = new User();
    if (($val = $user->register($req)) !== false) {
        Response::send($val, 201, "Created new user");
    }
    Response::send(null, 400, $user->error);
} else if ($method === "GET" && !empty($_SESSION["username"])) { 
    $username = !empty($_GET["username"])? $_GET["username"]: $_SESSION["username"];

    $user = new User();
    $currentUser = $user->getUser($username);
    unset($currentUser["password"]);
    
    Response::send($currentUser);
} else {
    Response::not_found();
}

