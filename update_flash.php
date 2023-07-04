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

    // Mettre à jour l'état flash du QR code
    $query = "UPDATE qr_flash SET flash = 1 WHERE qrcode = :qrcode";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':qrcode', $qrcode);

    if ($stmt->execute()) {
        $response = [
            'success' => true,
            'message' => 'L\'état flash du QR code a été mis à jour avec succès'
        ];
    } else {
        $response = [
            'success' => false,
            'message' => 'Erreur lors de la mise à jour de l\'état flash du QR code'
        ];
    }

    echo json_encode($response);
}
?>
