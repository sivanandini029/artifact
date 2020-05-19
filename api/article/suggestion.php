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

if ($method === "GET") {
    $page = (!empty($_GET["page"]))? intval($_GET["page"]): 1;
    $results_per_page = 10;

    Database::init();
    $db_suggestions = Database::query("SELECT 
            a.id,
            a.title,
            a.description,
            a.content,
            a.topic,
            a.views,
            a.created,
            a.updated,
            (SELECT COUNT(*) FROM Impressions WHERE content_id = a.id and content_type = :type) AS impressions,
            u.username AS user_username,
            u.image AS user_image,
            u.status as user_status
        FROM Articles a, Users u WHERE a.status = :status AND a.owner_id = u.id ORDER BY impressions / a.views DESC LIMIT $results_per_page OFFSET ". $results_per_page * ( $page - 1 ),
        [
            ":status" => "SAVED",
            ":type" => "ARTICLE"
        ]);

    $suggestions = [];
    foreach ($db_suggestions as $e) {
        $suggestion = [];
        $suggestion["owner"] = json_decode("{}");
        foreach($e as $key => $value) {
            if (strpos($key, "user") === 0 && $e["user_status"] === "ACTIVE") {
                $new_key = substr($key, 5);
                $suggestion["owner"]->$new_key = $value;
            } else {
                $suggestion[$key] = $value;
            }
        }
        array_push($suggestions, $suggestion);
    }

    $data["suggestions"] = $suggestions;
    if ($page > 1) {
        $data["previous_page"] = "http://localhost/artifact/api/article/suggestion.php?page=". ($page-1);
    }

    if (count($suggestions) === $results_per_page) {
        $data["next_page"] = "http://localhost/artifact/api/article/suggestion.php?page=". ($page+1);
    }
    Response::send($data);

} else {
    Response::not_found();
}

