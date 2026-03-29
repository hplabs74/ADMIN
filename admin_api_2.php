<?php
require_once 'config.php';
header('Content-Type: application/json'); // Jelezzük, hogy JSON-t küldünk vissza


/* START -- ADMIN SECURITY => OUR PRICE PLAN SELECTABLE TABLE RECORD */

// 1. ADATBÁZIS KAPCSOLAT (Ezt pótold, ha nincs benne)
require_once 'db_connection.php'; 

// 2. BEÉRKEZŐ JSON ADATOK BEOLVASÁSA
$data = json_decode(file_get_contents('php://input'), true);

// 3. TÁBLÁZAT KEZELÉSE (Ezt szúrd be ide)
if (isset($data['action'])) {
    $table = $data['table']; // Ez jön a select-ből (pl. SUBSCRIPTION_PRICE_PLAN_1)

    // BIZTONSÁGI ELLENŐRZÉS: Csak ezeket a táblákat engedjük meg
    $allowed_tables = ['SUBSCRIPTION_PRICE_PLAN_1', 'SUBSCRIPTION_PRICE_PLAN_2', 'SUBSCRIPTION_PRICE_PLAN_3', 'SUBSCRIPTION_PRICE_PLAN_4'];
    
    if (!in_array($table, $allowed_tables)) {
        echo json_encode(['success' => false, 'error' => 'Érvénytelen táblanév!']);
        exit;
    }

    // --- ÚJ SOR HOZZÁADÁSA ---
    if ($data['action'] === 'insert') {
        $poor   = $data['poor'];
        $middle = $data['middle'];
        $rich   = $data['rich'];
        $cpu    = $data['cpu'];

        // Itt a táblanevet közvetlenül illesztjük be, az értékeket pedig biztonságosan (prepared statement)

        $query = "INSERT INTO `$table` (poor_price_in_usd, middle_price_in_usd, rich_price_in_usd, how_much_max_kg_cpu_can_buy) VALUES (?, ?, ?, ?)"; // ez egy rekord felvétel ha a tábla név változóban
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssss", $poor, $middle, $rich, $cpu);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $conn->error]);
        }
        exit;
    }

    // --- ADATOK LEKÉRÉSE ---
    if ($data['action'] === 'fetch') {
        $query = "SELECT * FROM `$table` ORDER BY created_at DESC";
        $result = $conn->query($query);
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        
        echo json_encode(['success' => true, 'data' => $rows]);
        exit;
    }
}
/* END -- ADMIN SECURITY => OUR PRICE PLAN SELECTABLE TABLE RECORD */


// START -- PHPMailer manuális betöltése (Módosítsd az útvonalat, ha máshová tetted!)
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer/PHPMailer.php';
require 'PHPMailer/PHPMailer/SMTP.php';

// END -- PHPMailer manuális betöltése (Módosítsd az útvonalat, ha máshová tetted!)


/* START -- PART 1 --- TAB 1 MOBIL NUMBER VALIDATION PROCESS */
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

/* END -- PART 1 --- TAB 1 MOBIL NUMBER VALIDATION PROCESS */
    
    // START --- PHPMailer SENDING
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
        $mail->AltBody = "Your verification code is: $code. It expires first time in 2 minutes, if you are late with first time with 8 digit code, second time you have 5 minutes.";
        
        $mail->send();
        echo json_encode(['success' => true, 'expires' => $expires]);
        
        $response = ['success' => true, 'expires' => $expires]; // elküldjük a frontendnek is
        
    } catch (Exception $e) {
        // Ha az e-mail küldés elbukik, naplózzuk a hibát, de a júzernek csak annyit mondunk: hiba történt
        error_log("PHPMailer hiba: " . $mail->ErrorInfo);
        echo json_encode(['success' => false, 'error' => 'Email could not be sent.']);
    }
    exit;
    
// END --- PHPMailer SENDING
/*
    // Email küldés (egyszerű mail, klasszikus de védtelen módszer )
    $subject = "Your verification code";
    $message = "Your verification code is: $code\nIt expires in 2 minutes.";
    $headers = "From: office@goldenantspowers.com\r\n";
    mail($email, $subject, $message, $headers);

    $response = ['success' => true, 'expires' => $expires]; // elküldjük a frontendnek is
    echo json_encode($response);
    exit;
*/    
    
}

/* START -- PART 2 --- TAB 1 MOBIL NUMBER VALIDATION PROCESS */
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

/* END -- PART 2 --- TAB 1 MOBIL NUMBER VALIDATION PROCESS */
