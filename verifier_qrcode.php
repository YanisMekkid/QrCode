<?php
// Connexion à la base de données
$servername = "localhost";
$username = "root";
$password = "test";
$dbname = "qrcode";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Erreur de connexion à la base de données : " . $conn->connect_error);
}

// Récupération du contenu du QR code scanné
$qrCodeContent = $_GET['qrcode'];

// Recherche du QR code dans la table qr_flash
$query = "SELECT * FROM qr_flash WHERE QrCode = '$qrCodeContent'";
$result = $conn->query($query);

$flashValue = 0;

if ($result->num_rows > 0) {
    // Le QR code existe dans la table qr_flash
    $row = $result->fetch_assoc();
    $flashValue = $row['flash'];

} else {
    // Le QR code n'existe pas dans la table qr_flash, insérer le nouveau QR code
    $insertQuery = "INSERT INTO qr_flash (QrCode, flash) VALUES ('$qrCodeContent', '1')";
    if ($conn->query($insertQuery) === TRUE) {
        echo "Le QR code a été ajouté avec succès à la base de données.";
    } else {
        echo "Erreur lors de l'ajout du QR code à la base de données : " . $conn->error;
    }
}

// Fermeture de la connexion à la base de données
$conn->close();

echo $flashValue;
?>
