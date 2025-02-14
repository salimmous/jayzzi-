<?php
require_once 'config.php';
require_once 'Database.php';

try {
    Logger::log("Starting database connection test");
    $db = Database::getInstance();
    echo "Database connection successful!\n";
    
    // Test query
    $result = $db->fetch("SELECT NOW() as time");
    if ($result) {
        echo "Current database time: " . $result['time'] . "\n";
        Logger::log("Test query executed successfully");
    } else {
        throw new Exception("Test query failed");
    }
    
} catch (Exception $e) {
    Logger::error("Database test failed", [
        'error' => $e->getMessage(),
        'code' => $e->getCode()
    ]);
    echo "Database connection error: " . $e->getMessage() . "\n";
    exit(1);
}
