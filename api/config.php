<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name'); // Update this
define('DB_USER', 'your_database_user'); // Update this
define('DB_PASS', 'your_database_password'); // Update this
define('DB_CHARSET', 'utf8mb4');

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/error.log');

// Create logs directory if it doesn't exist
if (!file_exists(__DIR__ . '/logs')) {
    mkdir(__DIR__ . '/logs', 0755, true);
}

// CORS settings
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// JWT settings
define('JWT_SECRET', 'your-secret-key'); // Update this with a secure random string
define('JWT_EXPIRY', 86400); // 24 hours

// API settings
define('API_VERSION', '1.0.0');
define('API_BASE_PATH', '/api/v1');
