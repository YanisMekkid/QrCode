<?php
// Vérification des informations de connexion
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

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

    // Requête pour récupérer l'utilisateur correspondant aux informations de connexion
    $sql = "SELECT * FROM user WHERE username = '$username'";
    $result = $conn->query($sql);

    // Vérification du résultat de la requête
    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        $hashedPassword = $row["password"];

        // Vérification du mot de passe haché
        if (md5($password,$hashedPassword)) {
            // Authentification réussie, redirigez vers la page d'administration
            session_start();
            $_SESSION["loggedin"] = true;
            header("Location: admin-page.php");
            exit();
        }
    }

    // Informations de connexion invalides, affichez un message d'erreur
    $error_message = "Identifiant ou mot de passe incorrect.";

    // Fermeture de la connexion à la base de données
    $conn->close();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Connexion Administrateur</title>
    <link rel="stylesheet" href="css\style.css" type="text/css"/>
</head>
<body>
  <div class="form-container">
    <h1>Connexion Administrateur</h1>

    <?php if (isset($error_message)) : ?>
        <p class="error"><?php echo $error_message; ?></p>
    <?php endif; ?>

    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
        <label for="username">Nom d'utilisateur :</label>
        <input type="text" id="username" name="username" required><br><br>

        <label for="password">Mot de passe :</label>
        <input type="password" id="password" name="password" required><br><br>

        <input type="submit" value="Se connecter">
    </form>
  </div>
</body>
</html>
