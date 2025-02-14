<?php
require_once 'config.php';
require_once 'Database.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Parse request
$request = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Remove base path if exists
$request = str_replace(API_BASE_PATH, '', $request);

// Parse request path
$path = parse_url($request, PHP_URL_PATH);
$pathSegments = explode('/', trim($path, '/'));

// Route request
try {
    $db = Database::getInstance();
    
    switch ($pathSegments[0]) {
        case 'auth':
            require_once 'controllers/AuthController.php';
            $controller = new AuthController($db);
            break;
            
        case 'articles':
            require_once 'controllers/ArticleController.php';
            $controller = new ArticleController($db);
            break;
            
        case 'images':
            require_once 'controllers/ImageController.php';
            $controller = new ImageController($db);
            break;
            
        case 'pins':
            require_once 'controllers/PinController.php';
            $controller = new PinController($db);
            break;
            
        case 'keywords':
            require_once 'controllers/KeywordController.php';
            $controller = new KeywordController($db);
            break;
            
        default:
            throw new Exception('Route not found', 404);
    }

    // Handle request
    switch ($method) {
        case 'GET':
            $response = $controller->get($pathSegments);
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $response = $controller->post($pathSegments, $data);
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            $response = $controller->put($pathSegments, $data);
            break;
            
        case 'DELETE':
            $response = $controller->delete($pathSegments);
            break;
            
        default:
            throw new Exception('Method not allowed', 405);
    }

    // Send response
    echo json_encode([
        'success' => true,
        'data' => $response
    ]);

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
