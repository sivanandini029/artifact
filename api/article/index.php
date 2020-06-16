<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ ."/../class/Response.php");
require_once(__DIR__ ."/../class/Request.php");
require_once(__DIR__ ."/../class/User.php");
require_once(__DIR__ ."/../class/Article.php");

session_start();
$method = (!empty($_SERVER["REQUEST_METHOD"]))? $_SERVER["REQUEST_METHOD"]: "GET";

if ($method === "GET" && !empty($_GET['id'])) {
    $id = $_GET['id'];
    $article = new Article();
    if ($article->get_id($id) !== false) {
        Response::send($article, 200);
    }
    Response::send(null, 404, "Requested article was not found");
} else if ($method === "POST" && !empty($_SESSION["username"])) { 
    $req = Request::parse();

    $user = new User();
    $user->get_user($_SESSION["username"]);
    
    $article = new Article();
    $article->title = @$req->title;
    $article->description = @$req->description;
    $article->content = @$req->content;
    $article->topic = @$req->topic;
    $article->owner = $user;

    if ($article->create() !== false) {
        Response::send($article);
    }

    Response::send(null, 400, $article->get_error());
    
}  else if ($method === "PATCH" && !empty($_SESSION["username"] && !empty($_GET["id"]))) {
    
    $req = Request::parse();
    $id = $_GET["id"];

    $article = new Article();
    if ($article->get_id($id, false) === false || $article->owner->username !== $_SESSION["username"]) {
        Response::send(null, 404, "Article was not found");
    }
    
    if ($article->update($req) === false) {
        Response::send(null, 400, $article->get_error());
    }

    $article->get_id($id, false);

    Response::send($article);
} else {
    Response::not_found();
}

