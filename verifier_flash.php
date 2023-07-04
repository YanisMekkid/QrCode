<?php
// Connexion à la base de données
$servername = "localhost";
$dbusername = "root";
$dbpassword = "test";
$dbname = "qrcode";

$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

// Vérification des erreurs de connexion à la base de données
if ($conn->connect_error) {
    die("Échec de la connexion à la base de données: " . $conn->connect_error);
}

if (isset($_POST['qrcode'])) {
    $qrcode = $_POST['qrcode'];

    // Vérifier si le QR code a déjà été flashé
    $query = "SELECT flash FROM qr_flash WHERE qrcode = :qrcode";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':qrcode', $qrcode);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        $flashStatus = $result['flash'];

        if ($flashStatus == 1) {
            // QR code déjà flashé
            $response = [
                'flash' => '1',
                'message' => 'Le QR code a déjà été flashé'
            ];
        } else {
            // QR code non flashé
            $response = [
                'flash' => '0',
                'message' => 'Le QR code n\'a pas encore été flashé'
            ];

            // Mettre à jour l'état flash du QR code
            $updateQuery = "UPDATE qr_flash SET flash = 1 WHERE qrcode = :qrcode";
            $updateStmt = $pdo->prepare($updateQuery);
            $updateStmt->bindParam(':qrcode', $qrcode);
            $updateStmt->execute();
        }
    } else {
        // QR code non trouvé dans la base de données
        $response = [
            'flash' => '-1',
            'message' => 'Le QR code n\'existe pas dans la base de données'
        ];
    }

    echo json_encode($response);
}
?>
