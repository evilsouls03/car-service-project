<?php
// Include database configuration
require_once 'config.php';

// Initialize response array
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize
    $email = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));
    $password = trim($_POST['password']);
    $remember = isset($_POST['remember']) ? true : false;
    
    // Validate email
    if (empty($email)) {
        $response['errors'][] = 'Email is required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors'][] = 'Invalid email format';
    }
    
    // Validate password
    if (empty($password)) {
        $response['errors'][] = 'Password is required';
    }
    
    // If no validation errors, attempt login
    if (empty($response['errors'])) {
        try {
            // Get user from database
            $stmt = $pdo->prepare("SELECT id, name, email, password, is_verified, is_admin FROM users WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch();
                
                // Verify password
                if (password_verify($password, $user['password'])) {
                    // Check if account is verified
                    if ($user['is_verified'] == 0) {
                        $response['message'] = 'Please verify your email address before logging in';
                    } else {
                        // Start session
                        session_start();
                        
                        // Set session variables
                        $_SESSION['user_id'] = $user['id'];
                        $_SESSION['user_name'] = $user['name'];
                        $_SESSION['user_email'] = $user['email'];
                        $_SESSION['is_admin'] = $user['is_admin'];
                        $_SESSION['logged_in'] = true;
                        
                        // Set remember me cookie if selected
                        if ($remember) {
                            // Generate a unique token
                            $token = bin2hex(random_bytes(32));
                            
                            // Store token in database
                            $stmt = $pdo->prepare("UPDATE users SET remember_token = ? WHERE id = ?");
                            $stmt->execute([$token, $user['id']]);
                            
                            // Set cookie that expires in 30 days
                            setcookie('remember_token', $token, time() + (86400 * 30), '/');
                        }
                        
                        // Set success response
                        $response['success'] = true;
                        $response['message'] = 'Login successful';
                        
                        // Redirect based on user role
                        if ($user['is_admin'] == 1) {
                            header('Location: ../admin/dashboard.php');
                        } else {
                            header('Location: ../dashboard.html');
                        }
                        exit;
                    }
                } else {
                    $response['message'] = 'Invalid email or password';
                }
            } else {
                $response['message'] = 'Invalid email or password';
            }
        } catch (PDOException $e) {
            $response['message'] = 'Login failed: ' . $e->getMessage();
        }
    } else {
        $response['message'] = 'Please correct the errors below';
    }
    
    // If we reach here with errors, return to the login form
    if (!$response['success']) {
        // Store errors in session to display on form
        session_start();
        $_SESSION['login_errors'] = $response['errors'];
        $_SESSION['login_message'] = $response['message'];
        $_SESSION['form_data'] = [
            'email' => $email
        ];
        
        // Redirect back to login form
        header('Location: ../login.html');
        exit;
    }
} else {
    // Not a POST request
    header('Location: ../login.html');
    exit;
}
