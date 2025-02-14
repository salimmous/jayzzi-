<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../Database.php';

try {
    $db = Database::getInstance();
    
    // Read and execute schema.sql
    $schema = file_get_contents(__DIR__ . '/schema.sql');
    if (!$schema) {
        throw new Exception('Could not read schema.sql');
    }
    
    // Execute each statement separately
    $statements = array_filter(
        array_map('trim', 
            explode(';', $schema)
        )
    );

    foreach ($statements as $statement) {
        if (!empty($statement)) {
            try {
                $db->execute($statement);
            } catch (Exception $e) {
                // Log the error but continue with other statements
                error_log("Error executing statement: " . $e->getMessage());
            }
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Database setup completed successfully'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database setup error',
        'error' => $e->getMessage()
    ]);
}
