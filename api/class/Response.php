<?php
class Response {
    static $default_messages = [
        200 => "OK",
        201 => "Created",
        400 => "Bad request",
        404 => "The requested resourse was not found",
        401 => "Unauthorized request",
        500 => "Something went wrong on our end"
    ];

    static function send($data, $code = 200, $message = "") {
        $response = [];

        $response["statusCode"] = $code;
        $response["message"] = ($message == "")? self::$default_messages[$code]: $message;
        if (!empty($data)) {
            $response["data"] = $data;
        }

        http_response_code($code);
        echo json_encode($response);

        exit(0);
    }

    static function not_found($message = "") {
        self::send(null, 404, $message);
    }
}