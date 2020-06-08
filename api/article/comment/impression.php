<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ ."/../../class/Response.php");
require_once(__DIR__ ."/../../class/Request.php");
require_once(__DIR__ ."/../../class/User.php");
require_once(__DIR__ ."/../../class/Article.php");

session_start();
$method = (!empty($_SERVER["REQUEST_METHOD"]))? $_SERVER["REQUEST_METHOD"]: "GET";

if ($method === "POST" && !empty($_SESSION["username"]) && !empty($_GET["id"])) { 
    $viewer = new User();
    $viewer->get_user($_SESSION["username"]);
    
    $id = $_GET["id"];
    $comment = new Comment();
    if ($comment->get_id($id) === false) {
        Response::send(null, 404, "Comment was not found");
    }

    $article = new Article();
    if ($article->get_id($comment->article_id, false) === false) {
        Response::send(null, 404, "Comment was not found");
    }

    $comment->toggle_impression($viewer);
    Response::send($comment, 200);
} else {
    Response::not_found();
}

