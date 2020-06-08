<?php
require_once(__DIR__ ."/Database.php");

class Comment {
    private $error = "";

    function create($user, $article, $content) {
        Database::init();
        if (empty($content) || strlen($content) < 10) {
            $this->error = "comment should be atleast 10 characters";
            return false;
        }

        Database::query(
            "INSERT INTO Comments
                (article_id, user_id, content, created)
            VALUES
                (:article_id, :user_id, :content, :created)",
            [
                ":article_id" => $article->id,
                ":user_id" => $user->id,
                ":content" => $content,
                ":created" => time(),
            ]      
        );

        $this->id = Database::last_insert_id();
        $this->content = $content;
        $this->username = $user->username;
        $this->image = $user->image;
        $this->impressions = 0;
        $this->viewer_has_liked = false;
        $this->created = time();

        return true;
    }

    function get_id($id) {
        Database::init();
        $result = Database::query(
            "SELECT
                id,
                article_id,
                user_id,
                content,
                created,
                (SELECT COUNT(*) FROM Impressions WHERE content_id = c.id and content_type = :type) AS impressions,
                (SELECT COUNT(*) FROM Impressions i, Users us WHERE content_id = c.id AND content_type = :type AND i.user_id = us.id AND us.username = :username) AS viewer_has_liked
            FROM Comments c WHERE
                id = :id
            LIMIT 1",    
            [
                ":type" => "COMMENT",
                ":username" => (!empty($_SESSION["username"]))? $_SESSION["username"]: "",
                ":id" => $id
            ]
        );

        if (count($result) < 0) {
            return false;
        }
        
        $this->assign_values($result[0]);
        if ($this->viewer_has_liked > 0) {
            $this->viewer_has_liked = true;
        } else {
            $this->viewer_has_liked = false;
        }

        return true;
    }

    function toggle_impression($viewer) {
        Database::init();
        if ($this->viewer_has_liked) {
            Database::query("DELETE FROM Impressions WHERE user_id = :u_id AND content_id = :id AND content_type = :type",
            [
                ":u_id" => $viewer->id,
                ":id" => $this->id,
                ":type" => "COMMENT"
            ]);
            $this->viewer_has_liked = false;
            $this->impressions--;
        } else {
            Database::query("INSERT INTO Impressions (user_id, content_id, content_type) VALUES (:u_id, :id, :type)",
            [
                ":u_id" => $viewer->id,
                ":id" => $this->id,
                ":type" => "COMMENT"
            ]);

            $this->impressions++;
            $this->viewer_has_liked = true;
        }
    }

    function get_all_article($id) {
        Database::init();
        $comments = Database::query(
            "SELECT 
                c.id,
                c.content,
                u.username,
                u.image,
                c.created,
                (SELECT COUNT(*) FROM Impressions WHERE content_id = c.id and content_type = :type) AS impressions,
                (SELECT COUNT(*) FROM Impressions i, Users us WHERE content_id = c.id AND content_type = :type AND i.user_id = us.id AND us.username = :username) AS viewer_has_liked
            FROM
                Comments c, Users u
            WHERE
                u.id = c.user_id AND
                c.status = :status AND
                c.article_id = :id",
            [
                ":type" => "COMMENT",
                ":status" => "ACTIVE",
                ":id" => $id,
                ":username" => (!empty($_SESSION["username"]))? $_SESSION["username"]: "",
            ]
        );

        for ($i = 0; $i < count($comments); $i++) {
            if ($comments[$i]["viewer_has_liked"] > 0) {
                $comments[$i]["viewer_has_liked"] = true;
            } else {
                $comments[$i]["viewer_has_liked"] = false;
            }
        }
        return $comments;
    }

    function assign_values($values) {
        foreach ($values as $key => $value) {
            $this->$key = $value;
        }
    }

    function get_error() {
        return $this->error;
    }
}