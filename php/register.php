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
    $name = trim(filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING));
    $email = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));
    $phone = trim(filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING));
    $password = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm_password']);
    
    // Validate name
    if (empty($name)) {
        $response['errors'][] = 'Name is required';
    }
    
    // Validate email
    if (empty($email)) {
        $response['errors'][] = 'Email is required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors'][] = 'Invalid email format';
    } else {
        // Check if email already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->rowCount() > 0) {
            $response['errors'][] = 'Email already exists';
        }
    }
    
    // Validate phone
    if (empty($phone)) {
        $response['errors'][] = 'Phone number is required';
    }
    
    // Validate password
    if (empty($password)) {
        $response['errors'][] = 'Password is required';
    } elseif (strlen($password) < 8) {
        $response['errors'][] = 'Password must be at least 8 characters long';
    }
    
    // Validate password confirmation
    if ($password !== $confirm_password) {
        $response['errors'][] = 'Passwords do not match';
    }
    
    // If no errors, proceed with registration
    if (empty($response['errors'])) {
        try {
            // Hash the password
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            
            // Generate verification token
            $verification_token = bin2hex(random_bytes(32));
            
            // Insert user into database
            $stmt = $pdo->prepare("INSERT INTO users (name, email, phone, password, verification_token, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
            $stmt->execute([$name, $email, $phone, $hashed_password, $verification_token]);
            
            // Get the user ID
            $user_id = $pdo->lastInsertId();
            
            // Send verification email (in a real application)
            // sendVerificationEmail($email, $name, $verification_token);
            
            // Set success response
            $response['success'] = true;
            $response['message'] = 'Registration successful! Please check your email to verify your account.';
            
            // Start session and set user data
            session_start();
            $_SESSION['registration_success'] = true;
            $_SESSION['user_email'] = $email;
            
            // Redirect to login page
            header('Location: ../login.html?registered=true');
            exit;
            
        } catch (PDOException $e) {
            $response['message'] = 'Registration failed: ' . $e->getMessage();
        }
    } else {
        $response['message'] = 'Please correct the errors below';
    }
    
    // If we reach here with errors, return to the registration form
    if (!$response['success']) {
        // Store errors in session to display on form
        session_start();
        $_SESSION['registration_errors'] = $response['errors'];
        $_SESSION['form_data'] = [
            'name' => $name,
            'email' => $email,
            'phone' => $phone
        ];
        
        // Redirect back to registration form
        header('Location: ../login.html#register');
        exit;
    }
} else {
    // Not a POST request
    header('Location: ../login.html');
    exit;
}
