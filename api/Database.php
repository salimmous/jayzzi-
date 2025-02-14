<?php
require_once __DIR__ . '/Logger.php';

class Database {
    private $connection;
    private static $instance = null;

    private function __construct() {
        try {
            Logger::log("Attempting database connection");
            $this->connection = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
            Logger::log("Database connection established successfully");
        } catch (PDOException $e) {
            Logger::error("Database connection failed", [
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
            throw new Exception("Database connection failed", 500);
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->connection;
    }

    public function query($sql, $params = []) {
        $start = microtime(true);
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            $duration = round((microtime(true) - $start) * 1000, 2);
            Logger::query($sql, $params, $duration);
            return $stmt;
        } catch (PDOException $e) {
            Logger::error("Query failed", [
                'sql' => $sql,
                'params' => $params,
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
            return null;
        }
    }

    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt ? $stmt->fetchAll() : [];
    }

    public function fetch($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt ? $stmt->fetch() : null;
    }

    public function execute($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt ? $stmt->rowCount() : 0;
    }

    public function lastInsertId() {
        return $this->connection->lastInsertId();
    }

    public function beginTransaction() {
        Logger::log("Beginning transaction");
        return $this->connection->beginTransaction();
    }

    public function commit() {
        Logger::log("Committing transaction");
        return $this->connection->commit();
    }

    public function rollback() {
        Logger::log("Rolling back transaction");
        return $this->connection->rollback();
    }
}
