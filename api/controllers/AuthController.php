<?php
class AuthController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function post($segments, $data) {
        switch ($segments[1] ?? '') {
            case 'login':
                return $this->login($data);
                
            case 'register':
                return $this->register($data);
                
            case 'reset-password':
                return $this->resetPassword($data);
                
            default:
                throw new Exception('Invalid auth endpoint', 404);
        }
    }

    private function login($data) {
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (!$email || !$password) {
            throw new Exception('Email and password are required', 400);
        }

        $user = $this->db->fetch(
            "SELECT id, email, password, name FROM users WHERE email = ?",
            [$email]
        );

        if (!$user || !password_verify($password, $user['password'])) {
            throw new Exception('Invalid credentials', 401);
        }

        // Generate JWT token
        $token = $this->generateToken($user);

        return [
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name']
            ],
            'token' => $token
        ];
    }

    private function register($data) {
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $name = $data['name'] ?? '';

        if (!$email || !$password) {
            throw new Exception('Email and password are required', 400);
        }

        // Check if user exists
        $existing = $this->db->fetch(
            "SELECT id FROM users WHERE email = ?",
            [$email]
        );

        if ($existing) {
            throw new Exception('Email already registered', 409);
        }

        // Create user
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $this->db->execute(
            "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
            [$email, $hashedPassword, $name]
        );

        return ['message' => 'Registration successful'];
    }

    private function resetPassword($data) {
        $email = $data['email'] ?? '';

        if (!$email) {
            throw new Exception('Email is required', 400);
        }

        // Check if user exists
        $user = $this->db->fetch(
            "SELECT id FROM users WHERE email = ?",
            [$email]
        );

        if (!$user) {
            throw new Exception('Email not found', 404);
        }

        // Generate reset token
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

        $this->db->execute(
            "UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?",
            [$token, $expires, $user['id']]
        );

        // In production, send email with reset link
        return ['message' => 'Password reset instructions sent'];
    }

    private function generateToken($user) {
        $payload = [
            'sub' => $user['id'],
            'email' => $user['email'],
            'iat' => time(),
            'exp' => time() + JWT_EXPIRY
        ];

        return JWT::encode($payload, JWT_SECRET);
    }
}
