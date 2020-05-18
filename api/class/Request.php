<?php
class Request {
    static function parse() {
        try {
            $data = json_decode(file_get_contents("php://input"), false, 512, JSON_THROW_ON_ERROR);
            return $data;
        } catch (JsonException $e) {
            Response::send(null, 400, "Ill formated data given");
        }
    }
}