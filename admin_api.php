<?php
require_once 'config.php';

// PHPMailer manuális betöltése (Módosítsd az útvonalat, ha máshová tetted!)
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer/PHPMailer.php';
require 'PHPMailer/PHPMailer/SMTP.php';


header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

$response = ['success' => false, 'error' => 'Invalid action'];


if ($action === 'requestCode') {
    $mobile = $input['mobile'] ?? '';
    if (!$mobile) {
        $response['error'] = 'Mobile number required';
        echo json_encode($response);
        exit;
    }

    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        $response['error'] = 'Database connection failed';
        echo json_encode($response);
        exit;
    }

    // Lekérdezzük az emailt és szerepkört
    $stmt = $conn->prepare("SELECT email, role FROM users WHERE mobile = ?");
    $stmt->bind_param("s", $mobile);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        $response['error'] = 'Mobile number not registered';
        echo json_encode($response);
        exit;
    }
    $user = $result->fetch_assoc();
    $email = $user['email'];
    $role = $user['role'];

    // Generáljuk a kódot
    $code = strtoupper(bin2hex(random_bytes(4))); // 8 karakter

    // Lejárati idő másodpercben (jelenlegi idő + 120 másodperc)
    $expires = time() + 120; // 2 perc múlva

    // Frissítjük az adatbázist
    $stmt = $conn->prepare("UPDATE users SET verification_code = ?, code_expires = ? WHERE mobile = ?");
    $stmt->bind_param("sis", $code, $expires, $mobile); // 'i' az integer
    if (!$stmt->execute()) {
        error_log("SQL hiba: " . $stmt->error);
        $response['error'] = 'Database error';
        echo json_encode($response);
        exit;
    }
    
    // --- PHPMailer Küldés ---
    $mail = new PHPMailer(true);

    try {
        // SMTP beállítások (Hostinger adatok)
        $mail->isSMTP();
        $mail->Host       = 'smtp.hostinger.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'office@goldenantspowers.com'; 
        $mail->Password   = '2026OurMission$'; 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // TTLS használata
        $mail->Port       = 587;

        // Címzettek
        $mail->setFrom('office@goldenantspowers.com', 'Admin Security');
        $mail->addAddress($email);

        // Tartalom
        $mail->isHTML(true);
        $mail->Subject = 'Your Verification Code';
        $mail->Body    = "Your security code: <b style='font-size: 20px;'>$code</b><br><br>This code expires in 3 minutes.";
        $mail->AltBody = "Your verification code is: $code. It expires in 3 minutes.";
        
        $mail->send();
        echo json_encode(['success' => true, 'expires' => $expires]);
        
        $response = ['success' => true, 'expires' => $expires]; // elküldjük a frontendnek is
        
    } catch (Exception $e) {
        // Ha az e-mail küldés elbukik, naplózzuk a hibát, de a júzernek csak annyit mondunk: hiba történt
        error_log("PHPMailer hiba: " . $mail->ErrorInfo);
        echo json_encode(['success' => false, 'error' => 'Email could not be sent.']);
    }
    exit;
    

/*
    // Email küldés (egyszerű mail)
    $subject = "Your verification code";
    $message = "Your verification code is: $code\nIt expires in 2 minutes.";
    $headers = "From: office@goldenantspowers.com\r\n";
    mail($email, $subject, $message, $headers);

    $response = ['success' => true, 'expires' => $expires]; // elküldjük a frontendnek is
    echo json_encode($response);
    exit;
*/    
    
}


if ($action === 'verifyCode') {
    $mobile = $input['mobile'] ?? '';
    $code = $input['code'] ?? '';

    if (!$mobile || !$code) {
        $response['error'] = 'Mobile and code required';
        echo json_encode($response);
        exit;
    }

    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        $response['error'] = 'Database connection failed';
        echo json_encode($response);
        exit;
    }

    $stmt = $conn->prepare("SELECT role, verification_code, code_expires FROM users WHERE mobile = ?");
    $stmt->bind_param("s", $mobile);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        $response['error'] = 'Invalid mobile';
        echo json_encode($response);
        exit;
    }
    $user = $result->fetch_assoc();

    if ($user['verification_code'] !== $code) {
        $response['error'] = 'Invalid code';
        echo json_encode($response);
        exit;
    }

    // Összehasonlítás: ha a jelenlegi idő nagyobb, mint a tárolt lejárati idő, akkor lejárt
    if (time() > $user['code_expires']) {
        $response['error'] = 'Code expired';
        echo json_encode($response);
        exit;
    }

    // Sikeres
    $stmt = $conn->prepare("UPDATE users SET verification_code = NULL, code_expires = NULL WHERE mobile = ?");
    $stmt->bind_param("s", $mobile);
    $stmt->execute();

    $response = ['success' => true, 'role' => $user['role']];
    echo json_encode($response);
    exit;
}

// Ha nem ismert action
echo json_encode($response);
