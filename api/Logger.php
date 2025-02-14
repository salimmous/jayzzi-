<?php
class Logger {
    private static $logFile = __DIR__ . '/logs/app.log';
    private static $errorLogFile = __DIR__ . '/logs/error.log';
    private static $queryLogFile = __DIR__ . '/logs/query.log';

    public static function init() {
        $logsDir = __DIR__ . '/logs';
        if (!file_exists($logsDir)) {
            mkdir($logsDir, 0755, true);
        }
    }

    public static function log($message, $type = 'INFO') {
        $date = date('Y-m-d H:i:s');
        $logMessage = "[$date] [$type] $message" . PHP_EOL;
        file_put_contents(self::$logFile, $logMessage, FILE_APPEND);
    }

    public static function error($message, $context = []) {
        $date = date('Y-m-d H:i:s');
        $contextStr = !empty($context) ? ' Context: ' . json_encode($context) : '';
        $logMessage = "[$date] [ERROR] $message$contextStr" . PHP_EOL;
        file_put_contents(self::$errorLogFile, $logMessage, FILE_APPEND);
    }

    public static function query($sql, $params = [], $duration = null) {
        $date = date('Y-m-d H:i:s');
        $paramsStr = !empty($params) ? ' Params: ' . json_encode($params) : '';
        $durationStr = $duration ? " Duration: {$duration}ms" : '';
        $logMessage = "[$date] [QUERY] $sql$paramsStr$durationStr" . PHP_EOL;
        file_put_contents(self::$queryLogFile, $logMessage, FILE_APPEND);
    }
}

// Initialize logging
Logger::init();
