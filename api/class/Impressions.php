<?php

require_once(__DIR__ ."/Database.php");

class Impressions {
    
    function get_content_count($id, $type) {
        Database::init();
        var_dump(Database::query("SELECT COUNT(*) as impressions FROM Impressions WHERE content_id = :id AND content_type = :type",
        [
            ":id" => $id,
            ":type" => $type
        ]));
    }
}