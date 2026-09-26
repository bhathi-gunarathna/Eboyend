<?php

require_once __DIR__ . '/config.php';


$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ALLOWED_ORIGINS)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
   
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit();
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON payload');
    }

    $errors = [];
    $validated = [];

    if (empty($data['firstName'])) {
        $errors['firstName'] = 'First name is required';
    } else {
        $firstName = trim(strip_tags($data['firstName']));
        if (strlen($firstName) > 100) {
            $errors['firstName'] = 'First name must be less than 100 characters';
        } else {
            $validated['firstName'] = $firstName;
        }
    }

    if (empty($data['lastName'])) {
        $errors['lastName'] = 'Last name is required';
    } else {
        $lastName = trim(strip_tags($data['lastName']));
        if (strlen($lastName) > 100) {
            $errors['lastName'] = 'Last name must be less than 100 characters';
        } else {
            $validated['lastName'] = $lastName;
        }
    }

    if (empty($data['email'])) {
        $errors['email'] = 'Email is required';
    } else {
        $email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email format';
        } else {
            $validated['email'] = $email;
        }
    }

    if (!empty($data['phone'])) {
        $phone = trim(strip_tags($data['phone']));
        if (!preg_match('/^[\d\s\+\-\(\)]+$/', $phone)) {
            $errors['phone'] = 'Invalid phone number format';
        } else {
            $validated['phone'] = $phone;
        }
    } else {
        $validated['phone'] = '';
    }

    if (empty($data['comments'])) {
        $errors['comments'] = 'Comments are required';
    } else {
        $comments = trim(strip_tags($data['comments']));
        if (strlen($comments) > 2000) {
            $errors['comments'] = 'Comments must be less than 2000 characters';
        } else {
            $validated['comments'] = $comments;
        }
    }

    if (!isset($data['agreeTerms']) || $data['agreeTerms'] !== true) {
        $errors['agreeTerms'] = 'You must agree to the terms and conditions';
    } else {
        $validated['agreeTerms'] = true;
    }

    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit();
    }

    $submission = [
        'id' => uniqid(),
        'firstName' => $validated['firstName'],
        'lastName' => $validated['lastName'],
        'email' => $validated['email'],
        'phone' => $validated['phone'],
        'comments' => $validated['comments'],
        'agreeTerms' => $validated['agreeTerms'],
        'timestamp' => date('c'), // ISO 8601
        'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN'
    ];

    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0777, true);
    }
    
    $file_path = DATA_DIR . '/submissions.json';
    $current_data = [];
    
    // Use file locking
    $fp = fopen($file_path, 'c+');
    if ($fp && flock($fp, LOCK_EX)) {
        $file_size = filesize($file_path);
        if ($file_size > 0) {
            $content = fread($fp, $file_size);
            $current_data = json_decode($content, true) ?: [];
        }
        
        $current_data[] = $submission;
        
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($current_data, JSON_PRETTY_PRINT));
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);
    } else {
        throw new Exception('Unable to lock data file');
    }


    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
    $headers .= "From: " . SITE_NAME . " <" . EMAIL_FROM . ">\r\n";

    $user_subject = 'Thank you for contacting ' . SITE_NAME;
    $user_message = "
    <html>
    <head><title>Thank you for contacting us</title></head>
    <body>
        <h2>Hello {$validated['firstName']},</h2>
        <p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>
        <h3>Your Submission Summary:</h3>
        <ul>
            <li><strong>Name:</strong> {$validated['firstName']} {$validated['lastName']}</li>
            <li><strong>Email:</strong> {$validated['email']}</li>
            <li><strong>Phone:</strong> {$validated['phone']}</li>
            <li><strong>Message:</strong><br/>" . nl2br(htmlspecialchars($validated['comments'])) . "</li>
        </ul>
        <br>
        <p>Best Regards,<br>The " . SITE_NAME . " Team</p>
    </body>
    </html>
    ";
    @mail($validated['email'], $user_subject, $user_message, $headers . "Reply-To: " . EMAIL_FROM . "\r\n");

    $admin_subject = 'New Contact Form Submission - ' . $validated['firstName'] . ' ' . $validated['lastName'];
    $admin_message = "
    <html>
    <head><title>New Submission</title></head>
    <body>
        <h2>New Contact Form Submission</h2>
        <table border='1' cellpadding='10' cellspacing='0'>
            <tr><th>Field</th><th>Value</th></tr>
            <tr><td><strong>ID</strong></td><td>{$submission['id']}</td></tr>
            <tr><td><strong>Name</strong></td><td>{$validated['firstName']} {$validated['lastName']}</td></tr>
            <tr><td><strong>Email</strong></td><td>{$validated['email']}</td></tr>
            <tr><td><strong>Phone</strong></td><td>{$validated['phone']}</td></tr>
            <tr><td><strong>Terms Agreed</strong></td><td>Yes</td></tr>
            <tr><td><strong>Timestamp</strong></td><td>{$submission['timestamp']}</td></tr>
            <tr><td><strong>IP Address</strong></td><td>{$submission['ip_address']}</td></tr>
            <tr><td colspan='2'><strong>Comments:</strong><br/>" . nl2br(htmlspecialchars($validated['comments'])) . "</td></tr>
        </table>
    </body>
    </html>
    ";
    
    $admin_headers = $headers . "Reply-To: {$validated['email']}\r\n";
    foreach (ADMIN_EMAILS as $admin_email) {
        @mail($admin_email, $admin_subject, $admin_message, $admin_headers);
    }

    echo json_encode(['success' => true, 'message' => 'Thank you! Your message has been sent.']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'An internal error occurred.']);
}
