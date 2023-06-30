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

// Récupération des événements depuis la base de données avec le nombre de places restantes
$sql = "SELECT id, eventName, eventDesc, eventDate, eventPlace, COUNT(id) AS nbInscrits
        FROM qr_event
        LEFT JOIN qr_inscription_data i ON id = idEvenement
        GROUP BY id";
$result = $conn->query($sql);

if (!$result) {
    die("Erreur dans la requête SQL: " . $conn->error);
}

$evenements = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $id = $row["id"];
        $nom = $row["eventName"];
        $description = $row["eventDesc"];
        $date = $row["eventDate"];
        $placeTotal = $row["eventPlace"];
        $nbInscrits = $row["nbInscrits"];
        $placeRestantes = $placeTotal - $nbInscrits;

        $evenements[$id] = array(
            "nom" => $nom,
            "description" => $description,
            "date" => $date,
            "placeTotal" => $placeTotal,
            "placeRestantes" => $placeRestantes
        );
    }
} else {
    echo "Aucun événement trouvé.";
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
    <title>Accueil</title>
    <link rel="stylesheet" href="css/style.css" type="text/css"/>
</head>
<body>

<a class="admin-button" href="admin-login.php">Connexion administrateur</a>

<h1>Sélectionnez un événement</h1>
<div class="event-list">
    <?php foreach ($evenements as $id => $evenement) : ?>
        <div class="event-card">
            <h2><?php echo $evenement["nom"]; ?></h2>
            <p><?php echo $evenement["description"]; ?></p>
            <p>Date: <?php echo $evenement["date"]; ?></p>
            <?php if ($evenement["placeRestantes"] > 0) : ?>
                <p>Nombre de places restantes: <?php echo $evenement["placeRestantes"]; ?></p>
                <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                    <input type="hidden" name="evenement" value="<?php echo $id; ?>">
                    <input type="submit" value="Inscription">
                </form>
            <?php else : ?>
                <p>Toutes les places ont été occupées.</p>
            <?php endif; ?>
        </div>
    <?php endforeach; ?>
</div>

</body>
</html>
