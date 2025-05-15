-- Create database
CREATE DATABASE IF NOT EXISTS autocare_db;
USE autocare_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_verified TINYINT(1) DEFAULT 0,
    is_admin TINYINT(1) DEFAULT 0,
    verification_token VARCHAR(100),
    remember_token VARCHAR(100),
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    license_plate VARCHAR(20),
    mileage INT,
    vin VARCHAR(50),
    color VARCHAR(30),
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    duration_minutes INT NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    service_id INT NOT NULL,
    booking_reference VARCHAR(20) NOT NULL UNIQUE,
    appointment_datetime DATETIME NOT NULL,
    additional_notes TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Service history table
CREATE TABLE IF NOT EXISTS service_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    service_id INT NOT NULL,
    service_date DATETIME NOT NULL,
    mileage_at_service INT,
    technician_notes TEXT,
    cost DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    invoice_number VARCHAR(20) NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'overdue') NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_date DATETIME,
    due_date DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default services
INSERT INTO services (name, description, base_price, duration_minutes, created_at) VALUES
('Oil Change', 'Regular oil change service including oil filter replacement and basic inspection.', 29.99, 30, NOW()),
('Brake Service', 'Comprehensive brake inspection and repair including pad replacement and rotor resurfacing if needed.', 89.99, 60, NOW()),
('Tire Service', 'Tire rotation, balancing, and pressure check to ensure optimal tire performance and longevity.', 49.99, 45, NOW()),
('Engine Diagnostics', 'Computer diagnostic scan to identify engine issues and performance problems.', 69.99, 45, NOW()),
('AC Service', 'Air conditioning system check, refrigerant level check, and system performance evaluation.', 79.99, 60, NOW()),
('Full Service', 'Comprehensive vehicle maintenance including oil change, fluid checks, filter replacements, and multi-point inspection.', 149.99, 120, NOW());

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, phone, password, is_verified, is_admin, created_at) VALUES
('Admin User', 'admin@autocare.com', '(123) 456-7890', '$2y$10$8tGIx5g5xLJ1XhD3N1AHpuuZJ6vwwT3uXHcI1wEYoaQBRJFEFEHdq', 1, 1, NOW());
