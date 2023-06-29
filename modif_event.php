<?php
// Vérifiez si l'utilisateur est connecté
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    // L'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
    header("Location: admin-login.php");
    exit;
}

// Vérifiez si l'ID de l'événement à modifier est passé dans l'URL
if (!isset($_GET["id"])) {
    // Redirigez l'utilisateur vers la page appropriée ou affichez un message d'erreur
    header("Location: admin-events.php");
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
    header("Location: admin-events.php");
    exit;
}

// Récupérer les détails de l'événement à partir de la base de données
$event = $result->fetch_assoc();
$nom = $event["eventName"];
$description = $event["eventDesc"];
$date = $event["eventDate"];
$place = $event["eventPlace"];

// Traitement des modifications d'événements
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérer les valeurs saisies par l'utilisateur
    $newNom = $_POST["nom"];
    $newDescription = $_POST["description"];
    $newDate = date("Y-m-d", strtotime($_POST["date"]));
    $newPlace = $_POST["place"];

    // Requête de mise à jour SQL pour modifier l'événement dans la base de données
    $sql = "UPDATE qr_event SET eventName = '$newNom', eventDesc = '$newDescription', eventDate = '$newDate', eventPlace = '$newPlace' WHERE id = '$eventId'";
    if ($conn->query($sql) === TRUE) {
        // L'événement a été modifié avec succès, vous pouvez rediriger l'utilisateur ou effectuer d'autres actions nécessaires
        header("Location: admin-events.php");
        exit;
    } else {
        echo "Erreur lors de la modification de l'événement: " . $conn->error;
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Modification d'Evenement</title>
    <link rel="stylesheet" href="admin.css" type="text/css"/>
</head>
<body>
    <div class="newEvent">
        <h2>Modification d'Evenement</h2>
        <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"] . '?id=' . $eventId); ?>">
            <label for="nom">Nom de l'Evenement</label>
            <input type="text" id="nom" name="nom" value="<?php echo $nom; ?>" required>

            <label for="description">Description </label>
            <textarea id="description" name="description" required><?php echo $description; ?></textarea>

            <label for="date">Date </label>
            <input type="date" id="date" name="date" value="<?php echo $date; ?>" required></br></br></br>

            <label for="place">Nombre de Place </label>
            <input type="text" id="place" name="place" value="<?php echo $place; ?>" required>

            <input type="submit" value="Modifier">
        </form>
    </div>
</body>
</html>
