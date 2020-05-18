<?php
require_once(__DIR__ ."/../class/Database.php");

class User {
    public $error = "";

    function register($data) {
        $username = $data->username;
        $email = $data->email;
        $password = $data->password;
        
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
        $usr = $this->getUser($username);

        if ($usr === false || !password_verify($password, $usr["password"])) {
            return false;
        }
    }
    
    function getUser($username) {
        Database::init();
        $usr = Database::query("SELECT username, email, password, image, first_name, last_name, bio, website, dob FROM Users WHERE username = :username", [":username" => $username]);
        
        if (count($usr) < 1) {
            return false;
        }
        return $usr[0];
    }
}