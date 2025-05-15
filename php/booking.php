<?php
// Include database configuration
require_once 'config.php';

// Start session
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    // Redirect to login page
    header('Location: ../login.html?redirect=booking');
    exit;
}

// Initialize response array
$response = [
    'success' => false,
    'message' => '',
    'booking_id' => null,
    'errors' => []
];

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get user ID from session
    $user_id = $_SESSION['user_id'];
    
    // Get form data and sanitize
    $service_id = filter_input(INPUT_POST, 'service', FILTER_SANITIZE_NUMBER_INT);
    $vehicle_make = trim(filter_input(INPUT_POST, 'vehicle-make', FILTER_SANITIZE_STRING));
    $vehicle_model = trim(filter_input(INPUT_POST, 'vehicle-model', FILTER_SANITIZE_STRING));
    $vehicle_year = filter_input(INPUT_POST, 'vehicle-year', FILTER_SANITIZE_NUMBER_INT);
    $license_plate = trim(filter_input(INPUT_POST, 'license-plate', FILTER_SANITIZE_STRING));
    $mileage = filter_input(INPUT_POST, 'mileage', FILTER_SANITIZE_NUMBER_INT);
    $service_date = trim(filter_input(INPUT_POST, 'service-date', FILTER_SANITIZE_STRING));
    $service_time = trim(filter_input(INPUT_POST, 'service-time', FILTER_SANITIZE_STRING));
    $additional_notes = trim(filter_input(INPUT_POST, 'additional-notes', FILTER_SANITIZE_STRING));
    
    // Validate service
    if (empty($service_id)) {
        $response['errors'][] = 'Service selection is required';
    }
    
    // Validate vehicle details
    if (empty($vehicle_make)) {
        $response['errors'][] = 'Vehicle make is required';
    }
    
    if (empty($vehicle_model)) {
        $response['errors'][] = 'Vehicle model is required';
    }
    
    if (empty($vehicle_year)) {
        $response['errors'][] = 'Vehicle year is required';
    }
    
    // Validate appointment date and time
    if (empty($service_date)) {
        $response['errors'][] = 'Service date is required';
    } else {
        // Check if date is in the future
        $current_date = date('Y-m-d');
        if ($service_date < $current_date) {
            $response['errors'][] = 'Service date must be in the future';
        }
    }
    
    if (empty($service_time)) {
        $response['errors'][] = 'Service time is required';
    }
    
    // If no errors, proceed with booking
    if (empty($response['errors'])) {
        try {
            // Begin transaction
            $pdo->beginTransaction();
            
            // Check if vehicle exists for this user
            $stmt = $pdo->prepare("SELECT id FROM vehicles WHERE user_id = ? AND make = ? AND model = ? AND year = ? AND license_plate = ?");
            $stmt->execute([$user_id, $vehicle_make, $vehicle_model, $vehicle_year, $license_plate]);
            
            if ($stmt->rowCount() > 0) {
                // Vehicle exists, get ID
                $vehicle = $stmt->fetch();
                $vehicle_id = $vehicle['id'];
            } else {
                // Create new vehicle
                $stmt = $pdo->prepare("INSERT INTO vehicles (user_id, make, model, year, license_plate, mileage, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
                $stmt->execute([$user_id, $vehicle_make, $vehicle_model, $vehicle_year, $license_plate, $mileage]);
                $vehicle_id = $pdo->lastInsertId();
            }
            
            // Create booking
            $booking_reference = 'AC' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8));
            $appointment_datetime = $service_date . ' ' . $service_time;
            
            $stmt = $pdo->prepare("INSERT INTO bookings (user_id, vehicle_id, service_id, booking_reference, appointment_datetime, additional_notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'confirmed', NOW())");
            $stmt->execute([$user_id, $vehicle_id, $service_id, $booking_reference, $appointment_datetime, $additional_notes]);
            
            $booking_id = $pdo->lastInsertId();
            
            // Commit transaction
            $pdo->commit();
            
            // Set success response
            $response['success'] = true;
            $response['message'] = 'Booking successful!';
            $response['booking_id'] = $booking_id;
            $response['booking_reference'] = $booking_reference;
            
            // Store booking reference in session
            $_SESSION['booking_reference'] = $booking_reference;
            
            // Send confirmation email (in a real application)
            // sendBookingConfirmationEmail($user_email, $booking_reference, $service_name, $appointment_datetime);
            
            // Return JSON response
            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
            
        } catch (PDOException $e) {
            // Rollback transaction on error
            $pdo->rollBack();
            $response['message'] = 'Booking failed: ' . $e->getMessage();
        }
    } else {
        $response['message'] = 'Please correct the errors below';
    }
    
    // Return JSON response with errors
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
    
} else {
    // Not a POST request
    header('Location: ../booking.html');
    exit;
}
