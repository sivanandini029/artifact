<?php
class Keys {

    private $KEYS;

    private $excemptions = [ "DATABASE_TYPE", "DATABASE_PORT" ];

    function __construct() {
        $this->getConfigFromEnv = false;
        if (file_exists(__DIR__ . "/../.env")) {
            $this->KEYS = json_decode(file_get_contents(__DIR__ . "/../.env"));
        } else {
            $this->getConfigFromEnv = true;
        }
    }

    public function __get($property) {
        if ($this->getConfigFromEnv && getenv($property)) {
            return getenv($property);
        } else if (!$this->getConfigFromEnv && @property_exists($this->KEYS, $property)) {
            return $this->KEYS->$property;
        } else if (array_search($property, $this->excemptions) !== false) {
            // echo a warning that the config does not exist or just ignore.
            return "";
        } else {
            echo "Fatal error: No $property provided in configuration.\n";
            echo "Exiting\n";
            exit();
        }
    } 
}