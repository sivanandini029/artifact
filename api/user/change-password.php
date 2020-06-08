<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ ."/../class/Response.php");
require_once(__DIR__ ."/../class/Request.php");
require_once(__DIR__ ."/../class/User.php");

session_start();
$method = (!empty($_SERVER["REQUEST_METHOD"]))? $_SERVER["REQUEST_METHOD"]: "GET";

if ($method === "POST") {

    $req = Request::parse();
    
    $user = new User();

    if (($val = $user->register($req)) === false) {
        Response::send(null, 400, $user->get_error());
    }

    Response::send($val, 201, "Created new user.");

} else if ($method === "GET" && !empty($_SESSION["username"])) { 

    $username = !empty($_GET["username"])? $_GET["username"]: $_SESSION["username"];

    $user = new User();
    $user->get_user($username, false, true);
    
    if (empty($user->email)) {
        Response::not_found("user with username '{$username}' not found.");
    }

    Response::send($user);
    
} else if ($method === "PATCH" && !empty($_SESSION["username"])) {
    
    $req = Request::parse();
    $user = new User();
    
    if ($user->login($_SESSION["username"], @$req->old_password) === false) {
        Response::send(null, 401, "Incorrect password.");
    }
    
    if ($user->update_password(@$req->new_password) === false) {
        Response::send(null, 400, $user->get_error());
    }

    Response::send(null, 200, "Changed password.");
} else {
    Response::not_found();
}
