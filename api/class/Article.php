<?php
require_once(__DIR__ ."/../class/Database.php");

class Article {
    private $error = "";
    private $owner_id;

    function create() {
        $owner = !empty($this->owner)? $this->owner: "";
        $title = !empty($this->title)? $this->title: "";
        $description = !empty($this->description)? $this->description: "";
        $content = !empty($this->content)? $this->content: "";
        $topic = !empty($this->topic)? $this->topic: "";
        
        $error = [];
        
        if (empty($owner) || empty($owner->id)) {
            array_push($error, "owner is empty.");
        }
        
        if (empty($title)) {
            array_push($error, "title is empty.");
        } else if (strlen($title) < 5 || strlen($title) > 50) {
            array_push($error, "title must be between 5 and 50 characters");
        }

        if (empty($description)) {
            array_push($error, "description is empty.");
        } else if (strlen($description) < 10 || strlen($description) > 250) {
            array_push($error, "description must be between 10 and 250 characters");
        }

        if (empty($content)) {
            array_push($error, "content is empty.");
        } else if (strlen($content) < 50 || strlen($content) > 25000) {
            array_push($error, "description must be between 50 and 25000 characters");
        }

        if (empty($topic)) {
            array_push($error, "topic is empty.");
        } else if (strlen($topic) < 1 || strlen($topic) > 50) {
            array_push($error, "topic must be between 1 and 50 characters");
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

        return [ 
            "owner" => $owner,
            "title" => $title,
            "description" => $description,
            "content" => $content,
            "topic" => $topic,
         ];
    }
    
    function get_id($id) {
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
            status
        FROM Articles WHERE 
            id = :id",
        [
            ":id" => $id
        ]);

        
        if (count($article) < 1) {
            return false;
        }
        
        foreach ($article[0] as $key => $value) {
            $this->$key = $value;
        }

        return $this;
    }

    function get_owner_id() {
        return $this->owner_id;
    }

    function get_error() {
        return $this->error;
    }
}