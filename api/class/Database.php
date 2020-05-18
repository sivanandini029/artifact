<?php
require_once(__DIR__ ."/Response.php");
require_once(__DIR__ ."/Keys.php");


class Database {
    static public $conn;
    
    // get the database connection
    static function init(){ 
        $KEYS = new Keys();
        $hostname = $KEYS->DATABASE_HOST;
        $dbname = $KEYS->DATABASE_NAME;
        $username = $KEYS->DATABASE_USERNAME;
        $password = $KEYS->DATABASE_PASSWORD;
        $db = $db =  ($KEYS->DATABASE_TYPE == "")? "mysql": $KEYS->DATABASE_TYPE;
        $port = $port = ($KEYS->DATABASE_PORT == "")? "": "port={$KEYS->DATABASE_PORT};";
        
        self::$conn = null;

        try {
            self::$conn = new PDO("{$db}:host={$hostname};{$port}dbname={$dbname}", $username, $password);
            self::$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            Response::send(null, 500, "Connection error: " . $exception->getMessage());
        }
    }

    public static function query($query, $params = []) {
        try {
            $stmt = self::$conn->prepare($query);
            $stmt->execute($params);
            if ($stmt->columnCount() > 0) {
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                return true;
            }
        } catch(PDOException $exception) {
            $msg = $exception->getMessage();
            if (strpos($msg, "Duplicate entry") !== false) {
                Response::send("", 400, substr($msg, strpos($msg, "Duplicate entry")));
            }
            Response::send("", 500, $msg);
        }
    }
}