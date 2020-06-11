<?php
require_once(__DIR__ ."/Database.php");
require_once(__DIR__ ."/User.php");
require_once(__DIR__ ."/Comment.php");

class Article {
    private $error = "";
    private $owner_id;
    private $allowed_status = ["SAVED", "PUBLISHED"];
    private $allowed_topics = ["web"];

    function create() {
        $owner = !empty($this->owner)? $this->owner: "";
        $title = !empty($this->title)? $this->title: "";
        $description = !empty($this->description)? $this->description: "";
        $content = !empty($this->content)? $this->content: "";
        $topic = !empty($this->topic)? $this->topic: "";
        
        $error = [];
        
        if (empty($owner) || empty($owner->id)) {
            array_push($error, "Owner is empty.");
        }
        
        if (empty($title)) {
            array_push($error, "Title is empty.");
        } else if (strlen($title) < 5 || strlen($title) > 50) {
            array_push($error, "Title must be between 5 and 50 characters.");
        }

        if (empty($description)) {
            array_push($error, "Description is empty.");
        } else if (strlen($description) < 10 || strlen($description) > 250) {
            array_push($error, "Description must be between 10 and 250 characters.");
        }

        if (empty($content)) {
            array_push($error, "Content is empty.");
        } else if (strlen($content) < 50 || strlen($content) > 25000) {
            array_push($error, "Content must be between 50 and 25000 characters.");
        }

        if (empty($topic)) {
            array_push($error, "Topic is empty.");
        } else if (array_search($topic, $this->allowed_topics) === false) {
            array_push($error, "Topic is invalid.");
        }
        
        if (count($error) !== 0) {
            $this->error = implode("\n", $error);
            return false;
        }
        
        Database::init();
        Database::query("INSERT INTO Articles (
            owner_id,
            title,
            description,
            content,
            topic,
            created,
            updated
        ) VALUES (
            :owner_id,
            :title,
            :description,
            :content,
            :topic,
            :created,
            :updated
        )", [ 
            ":owner_id" => $this->owner->id,
            ":title" => $title,
            ":content" => $content,
            ":description" => $description,
            ":topic" => $topic,
            ":created" => time(),
            ":updated" => time()
        ]);

        $this->get_id(Database::last_insert_id());
        return true;
    }

    function update($value) {
        $errors = [];
        $request_params = array_keys(get_object_vars($value));

        if (!empty($value->title) && (strlen($value->title) < 5 || strlen($value->title) > 50)) {
            $errors[] = "Title must be between 5 and 50 characters.";
        } else if (array_search("title", $request_params) !== false) {
            $this->title = $value->title;
        }

        if (!empty($value->description) && (strlen($value->description) < 10 || strlen($value->description) > 250)) {
            $errors[] = "Description must be between 10 and 250 characters.";
        } else if (array_search("description", $request_params) !== false) {
            $this->description = $value->description;
        }

        if (!empty($value->content) && (strlen($value->description) < 50 || strlen($value->description) > 25000)) {
            $errors[] = "Content must be between 50 and 25000 characters.";
        } else if (array_search("content", $request_params) !== false) {
            $this->content = $value->content;
        }

        if (!empty($value->topic) && array_search($value->topic, $this->allowed_topics) === false) {
            $errors[] = "Topic is invalid";
        } else if (array_search("topic", $request_params) !== false) {
            $this->topic = $value->topic;
        }

        if (!empty($value->status) && array_search($value->status, $this->allowed_status) === false) {
            $errors[] = "Status is invalid";
        } else if (!empty($value->status)) {
            $this->status = $value->status;
        }

        if (count($errors) !== 0) {
            $this->error = implode("\n", $errors);
            return false;
        }

        Database::init();
        Database::query(
            "UPDATE Articles SET 
                title = :title,
                description = :description,
                content = :content,
                topic = :topic,
                updated = :updated,
                status = :status
            WHERE
                id = :id",
            [
                ":id" => $this->id,
                ":title" => $this->title,
                ":description" => $this->description,
                ":content" => $this->content,
                ":topic" => $this->topic,
                ":status" => $this->status,
                ":updated" => time()
            ]);
        return true;
    }
    
    function get_id($id, $add_view = true) {
        Database::init();
        $article = Database::query("SELECT 
            id,
            owner_id,
            title,
            description,
            content,
            topic,
            views,
            created,
            updated,
            status,
            (SELECT COUNT(*) FROM Impressions WHERE content_id = :id and content_type = :type) AS impressions
        FROM Articles WHERE 
            id = :id",
        [
            ":id" => $id,
            ":type" => "ARTICLE"
        ]);

        
        if (count($article) < 1) {
            return false;
        }
        
        $this->assign_values($article[0]);
        $this->get_has_liked();
        if ($add_view && $this->status === "PUBLISHED") {
            $this->update_views();
        }
        $owner = new User();
        $owner->get_id($this->owner_id);
        $this->owner = $owner;
        
        $this->get_comments();
        if (!($this->status === "PUBLISHED" || (!empty($_SESSION["username"]) && !empty($this->owner->username) && $_SESSION["username"] === $this->owner->username))) {
            return false;
        }
        
        return $this;
    }
    
    function assign_values($values) {
        foreach ($values as $key => $value) {
            $this->$key = $value;
        }
    }

    function get_has_liked() {
        $this->viewer_has_liked = false;
        Database::init();
        $count = Database::query("SELECT COUNT(*) AS num FROM Impressions i, Users u WHERE u.username = :username AND i.content_id = :id AND i.content_type = :type and i.user_id = u.id",
        [
            ":username" => (!empty($_SESSION["username"]))? $_SESSION["username"]: "",
            ":id" => $this->id,
            ":type" => "ARTICLE"
        ]);

        if ($count[0]["num"] > 0) {
            $this->viewer_has_liked = true;
        }
    }

    function toggle_impression($viewer) {
        Database::init();
        if ($this->viewer_has_liked) {
            Database::query("DELETE FROM Impressions WHERE user_id = :u_id AND content_id = :id AND content_type = :type",
            [
                ":u_id" => $viewer->id,
                ":id" => $this->id,
                ":type" => "ARTICLE"
            ]);
            $this->viewer_has_liked = false;
            $this->impressions--;
            $this->owner->impressions--;
        } else {
            Database::query("INSERT INTO Impressions (user_id, content_id, content_type) VALUES (:u_id, :id, :type)",
            [
                ":u_id" => $viewer->id,
                ":id" => $this->id,
                ":type" => "ARTICLE"
            ]);

            $this->impressions++;
            $this->owner->impressions++;
            $this->viewer_has_liked = true;

        }
    }

    function get_comments() {
        $comments = new Comment();

        $this->comments = $comments->get_all_article($this->id);
    }

    function update_views() {
        if ($this->status === "PUBLISHED") {
            $this->views++;
            Database::init();
            Database::query("UPDATE Articles SET views = :views WHERE id = :id", [":views" => $this->views, ":id" => $this->id]);
        }
    }

    function get_error() {
        return $this->error;
    }
}