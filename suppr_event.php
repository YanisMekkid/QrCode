<?php
// Vérifiez si l'utilisateur est connecté
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    // L'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
    header("Location: admin-login.php");
    exit;
}

// Vérifiez si l'ID de l'événement à supprimer est passé dans l'URL
if (!isset($_GET["id"])) {
    // Redirigez l'utilisateur vers la page appropriée ou affichez un message d'erreur
    header("Location: admin-page.php");
    exit;
}

// Récupérer l'ID de l'événement depuis l'URL
$eventId = $_GET["id"];

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

// Vérification si l'événement existe dans la base de données
$sql = "SELECT * FROM qr_event WHERE id = '$eventId'";
$result = $conn->query($sql);

if ($result->num_rows == 0) {
    // L'événement n'existe pas dans la base de données, redirigez l'utilisateur ou affichez un message d'erreur
    header("Location: admin-page.php");
    exit;
}

// Récupérer les détails de l'événement à partir de la base de données
$event = $result->fetch_assoc();
$nom = $event["eventName"];
$description = $event["eventDesc"];
$date = $event["eventDate"];
$place = $event["eventPlace"];

// Copier les données de l'événement dans la nouvelle table
$newTableName = "qr_event_archive"; // Nom de la nouvelle table
$sqlCopy = "INSERT INTO $newTableName (eventName, eventDesc, eventDate, eventPlace, id) VALUES ('$nom', '$description', '$date', '$place','$eventId')";
if ($conn->query($sqlCopy) !== TRUE) {
    echo "Erreur lors de la copie des données de l'événement: " . $conn->error;
}

// Supprimer l'événement de la table principale
$sqlDelete = "DELETE FROM qr_event WHERE id = '$eventId'";
if ($conn->query($sqlDelete) === TRUE) {
    // L'événement a été supprimé avec succès
} else {
    echo "Erreur lors de la suppression de l'événement: " . $conn->error;
}

$conn->close();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Supprimer un événement</title>
    <link rel="stylesheet" href="css\admin.css" type="text/css"/>
    <script>
        function showConfirmation() {
            alert("Suppression réussie");
        }
    </script>
</head>
<body>

    <h1>Supprimer un événement</h1>
    <div class="newEvent">
        <h2>Informations de l'événement</h2>
        <p>Nom: <?php echo $nom; ?></p>
        <p>Description: <?php echo $description; ?></p>
        <p>Date: <?php echo $date; ?></p>
        <p>Place: <?php echo $place; ?></p>

        <h2>Confirmation de suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer cet événement ?</p>
        <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"] . "?id=" . $eventId); ?>">
            <input type="submit" value="Supprimer" onclick="showConfirmation()">
        </form>
    </div>
</body>
</html>
