<?php
require_once(__DIR__ ."/Database.php");

class User {
    private $error = "";
    private $password;

    function register($data) {
        $username = @$data->username;
        $email = @$data->email;
        $password = @$data->password;
        
        $error = [];
        
        if (empty($username)) {
            array_push($error, "username is empty.");
        } else if (strlen($username) < 3) {
            array_push($error, "username is minimum 3 characters.");
        } else if (strlen($username) > 20) {
            array_push($error, "username is maximum 20 characters.");
        }
        
        if (empty($email)) {
            array_push($error, "email is empty.");
        } else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            array_push($error, "email is invalid.");
        }
        
        if (empty($password)) {
            array_push($error, "password is empty.");
        } else if (strlen($password) < 6) {
            array_push($error, "password is minimum 6 characters.");
        }
        
        if (count($error) !== 0) {
            $this->error = implode("\n", $error);
            return false;
        }

        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        
        Database::init();
        Database::query("INSERT INTO Users (username, email, password, created, updated) VALUES (:username, :email, :password, :created, :updated)", [ ":username" => $username, ":email" => $email, ":password" => $password_hash, ":created" => time(), ":updated" => time()]);

        return [ "username" => $username, "email" => $email ];
    }

    function login($username, $password) {
        $usr = $this->get_user($username, true);

        if ($usr === false || !password_verify($password, $usr["password"])) {
            return false;
        }
    }

    function update($value) {
        $errors = [];
        $request_params = array_keys(get_object_vars($value));

        if (!empty($value->first_name) && strlen($value->first_name) > 50) {
            $errors[] = "First name is maximum 50 characters.";
        } else if (array_search("first_name", $request_params) !== false) {
            $this->first_name = $value->first_name;
        }

        if (!empty($value->last_name) && strlen($value->last_name) > 50) {
            $errors[] = "Last name is maximum 50 characters.";
        } else if (array_search("last_name", $request_params) !== false) {
            $this->last_name = $value->last_name;
        }

        if (!empty($value->bio) && strlen($value->bio) > 255) {
            $errors[] = "Bio is maximum 255 characters.";
        } else if (array_search("bio", $request_params) !== false) {
            $this->bio = $value->bio;
        }

        if (!empty($value->website) && (strlen($value->website) > 255 || !filter_var($value->website, FILTER_VALIDATE_URL))) {
           $errors[] = "Website is invalid.";
        } else if (array_search("website", $request_params) !== false) {
            $this->website = $value->website;
        }
        
        if (!empty($value->dob) && strtotime($value->dob) === false) {
            $errors[] = "Dob is invalid.";
        } else if (array_search("dob", $request_params) !== false) {
            $unified_date = strtotime($value->dob);
            $this->dob = $unified_date;
        }

        if (!empty($value->username) && (strlen($value->username) < 3 || strlen($value->username) > 20)) {
            $error[] = "Username is between 3 and 20 characters.";
        } else if (!empty($value->username)) {
            $this->username = $value->username;
        }
        
        if (!empty($value->email) && !filter_var($value->email, FILTER_VALIDATE_EMAIL)) {
            $error[] = "Email is invalid.";
        } else if (!empty($value->email)) {
            $this->email = $value->email;
        }

        if (!empty($value->status) && array_search($value->status, ["DISABLED", "ACTIVE"]) === false) {
            $error = "Status is invalid";
        } else if (!empty($value->status)) {
            $this->status = $value->status;
        }

        if (count($errors) !== 0) {
            $this->error = implode("\n", $errors);
            return false;
        }

        Database::init();
        Database::query(
            "UPDATE Users SET 
                username = :username,
                email = :email,
                first_name = :first_name,
                last_name = :last_name,
                bio = :bio,
                website = :website,
                dob = :dob,
                updated = :updated,
                status = :status
            WHERE
                id = :id",
            [
                ":id" => $this->id,
                ":username" => $this->username,
                ":email" => $this->email,
                ":first_name" => $this->first_name,
                ":last_name" => $this->last_name,
                ":bio" => $this->bio,
                ":website" => $this->website,
                ":dob" => $this->dob,
                ":status" => $this->status,
                ":updated" => time()
            ]);
        return true;
    } 
    
    function update_password($password) {
        
        $errors = [];
        if (empty($password)) {
            array_push($errors, "password is empty.");
        } else if (strlen($password) < 6) {
            array_push($errors, "password is minimum 6 characters.");
        }
        if (count($errors) !== 0) {
            $this->error = implode("\n", $errors);
            return false;
        }

        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        
        Database::init();
        Database::query(
            "UPDATE Users SET 
                password = :password
            WHERE
                id = :id",
            [
                ":id" => $this->id,
                ":password" => $password_hash,
            ]);
        return true;
    }
    
    function get_user($username, $login = true, $show_articles = false) {
        Database::init();
        if ($login) {
            $usr = Database::query("SELECT id, username, email, password, image, first_name, last_name, bio, website, dob, created, updated, status FROM Users WHERE
                username = :username", 
            [
                ":username" => $username
                ]);
        } else {
            $usr = Database::query("SELECT id, username, email, password, image, first_name, last_name, bio, website, dob, created, updated, status FROM Users WHERE
                (username = :username AND status = :status) OR (username = :username AND username = :username_logged_in)", 
            [
                ":username" => $username,
                ":status" => "ACTIVE",
                ":username_logged_in" => !empty($_SESSION["username"])? $_SESSION["username"]: ""
            ]);
        }
        
        if (count($usr) < 1) {
            return false;
        }
        
        $this->assign_values($usr[0]);
        if ($show_articles) {
            $this->get_articles(empty($_SESSION["username"]) || $_SESSION["username"] !== $username);
        }
        
        return $usr[0];
    }

    function get_articles($show_only_published) {
        Database::init();
        if ($show_only_published) {
            $articles = Database::query(
                "SELECT 
                    id,
                    title,
                    description,
                    topic,
                    views,
                    created,
                    updated,
                    status,
                    (SELECT COUNT(*) FROM Impressions WHERE content_id = id and content_type = :type) AS impressions
                FROM Articles WHERE 
                    owner_id = :id AND status = :status",
                [
                    ":id" => $this->id,
                    ":type" => "ARTICLE",
                    ":status" => "PUBLISHED"
                ]
            );
        } else {
            $articles = Database::query(
                "SELECT 
                    id,
                    title,
                    description,
                    topic,
                    views,
                    created,
                    updated,
                    status,
                    (SELECT COUNT(*) FROM Impressions WHERE content_id = id and content_type = :type) AS impressions
                FROM Articles WHERE 
                    owner_id = :id",
                [
                    ":id" => $this->id,
                    ":type" => "ARTICLE"
                ]
            );

        }

        $user_articles = [];
        foreach ($articles as $article) {
            $user_article = new Article();
            $user_article->assign_values($article);
            $user_articles[] = $user_article;       
        }
        $this->articles = $user_articles;
    }
    
    function get_id($id) {
        Database::init();
        $usr = Database::query("SELECT 
            id, 
            username, 
            email, 
            password, 
            image, 
            first_name, 
            last_name, 
            bio, 
            website, 
            dob, 
            created, 
            updated, 
            status,
            (SELECT COUNT(*) FROM Impressions i, Articles a WHERE a.id = i.content_id AND i.content_type = :type) AS impressions,
            (SELECT COUNT(*) FROM Articles WHERE owner_id = :id AND STATUS = :status_article ) AS articles,
            (SELECT SUM(views) FROM Articles WHERE owner_id = :id AND STATUS = :status_article) AS views
        FROM Users WHERE 
            id = :id AND (status = :status OR username = :username)", 
        [
            ":id" => $id,
            ":status_article" => "PUBLISHED",
            ":status" => "ACTIVE",
            ":type" => "ARTICLE",
            ":username" => !empty($_SESSION["username"])? $_SESSION["username"]: ""
        ]);
        if (count($usr) < 1) {
            return false;
        }

        $this->assign_values($usr[0]);
        return $usr[0];
    }

    function assign_values($query_result) {
        foreach ($query_result as $key => $value) {
            $this->$key = $value;
        }
    }

    function get_error() {
        return $this->error;
    }
}