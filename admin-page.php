<?php
// Vérifiez si l'utilisateur est connecté
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    // L'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
    header("Location: admin-login.php");
    exit;
}

// Traitement des modifications d'événements
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérer les valeurs saisies par l'utilisateur
    $nom = $_POST["nom"];
    $description = $_POST["description"];
    $date = date("Y-m-d", strtotime($_POST["date"]));
    $place = $_POST["place"];

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

    // Requête d'insertion SQL pour ajouter l'événement à la base de données
    $sql = "INSERT INTO qr_event (eventName, eventDesc, eventDate, eventPlace) VALUES ('$nom', '$description', '$date', '$place')";
    if ($conn->query($sql) === TRUE) {
        // L'événement a été ajouté avec succès, vous pouvez rediriger l'utilisateur ou effectuer d'autres actions nécessaires
        header("Location: admin-page.php");
        exit;
    } else {
        echo "Erreur lors de l'ajout de l'événement: " . $conn->error;
    }

    $conn->close();
}

// Récupération des événements depuis la base de données
$servername = "localhost";
$dbusername = "root";
$dbpassword = "test";
$dbname = "qrcode";

$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

// Vérification des erreurs de connexion à la base de données
if ($conn->connect_error) {
    die("Échec de la connexion à la base de données: " . $conn->connect_error);
}

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

$conn->close();

?>

<!DOCTYPE html>
<html>
<head>
    <title>Administration des événements</title>
    <link rel="stylesheet" href="css\admin.css" type="text/css"/>
</head>
<body>
    <h1>Administration des événements</h1></br></br>

    <h2>Liste des événements</h2>
    <table>
        <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th>
        </tr>
        <?php foreach ($evenements as $id => $evenement) : ?>
            <tr>
                <td><?php echo $evenement["nom"]; ?></td>
                <td><?php echo $evenement["description"]; ?></td>
                <td><?php echo $evenement["date"]; ?></td>
                <td>
                    <a class="button" href="modif_event.php?id=<?php echo $id; ?>">Modifier</a> |
                    <a class="button" href="suppr_event.php?id=<?php echo $id; ?>">Supprimer</a>
                </td>

            </tr>
        <?php endforeach; ?>
    </table>
    <div class="newEvent">
      <h2>Ajouter un événement</h2>
      <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
          <label for="nom">Nom </label>
          <input type="text" id="nom" name="nom" required>

          <label for="description">Description </label>
          <textarea id="description" name="description" required></textarea>

          <label for="date">Date </label>
          <input type="date" id="date" name="date" required></br></br></br>

          <label for="place">Nombre de Place </label>
          <input type="text" id="place" name="place" required>

          <input type="submit" value="Ajouter">
        </form>
      </div></br></br></br>

      <div class="logout">
        <form method="post" action="admin-logout.php">
          <input type="submit" value="Déconnexion">
        </form>
      </div>

</body>
</html>
