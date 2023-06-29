<?php
// Connexion à la base de données (à adapter avec vos propres informations de connexion)
$servername = "localhost";
$dbusername = "root";
$dbpassword = "test";
$dbname = "qrcode";

$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

// Vérification des erreurs de connexion à la base de données
if ($conn->connect_error) {
    die("Échec de la connexion à la base de données: " . $conn->connect_error);
}

// Récupération des événements depuis la base de données
$sql = "SELECT * FROM qr_event";
$result = $conn->query($sql);

$evenements = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $id = $row["id"];
        $nom = $row["eventName"];
        $description = $row["eventDesc"];
        $date = $row["eventDate"];
        $place = $row["eventPlace"];

        $evenements[$id] = array(
            "nom" => $nom,
            "description" => $description,
            "date" => $date,
            "place" => $place
        );
    }
}

// Vérifier si un événement a été sélectionné
if (isset($_POST['evenement'])) {
    $evenementId = $_POST['evenement'];

    // Rediriger vers le formulaire d'inscription avec l'ID de l'événement
    header("Location: subscription.php?idEvenement=$evenementId");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Acceuil</title>
    <link rel="stylesheet" href="css\style.css" type="text/css"/>
</head>
<body>

<a class="admin-button" href="admin-login.php">Connexion administrateur</a>

<h1>Sélectionnez un événement </h1>
<div class="event-list">
    <?php foreach ($evenements as $id => $evenement) : ?>
        <div class="event-card">
            <h2><?php echo $evenement["nom"]; ?></h2>
            <p><?php echo $evenement["description"]; ?></p>
            <p>Date: <?php echo $evenement["date"]; ?></p>
            <p>Nombre de Place: <?php echo $evenement["place"]; ?></p>
            <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                <input type="hidden" name="evenement" value="<?php echo $id; ?>">
                <input type="submit" value="Inscription">
            </form>
        </div>
    <?php endforeach; ?>
</div>

</body>
</html>
