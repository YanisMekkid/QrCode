<?php include("qrcode.php"); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Formulaire d'inscription et génération de QR code</title>
    <link rel="stylesheet" href="css/style.css" type="text/css"/>
</head>
<body>
  <a class="admin-button2" href="index.php">Acceuil</a>
    <?php if (!$qrCodeGenere): ?>
    <div class="form-container">
      <h1>Inscription à l'événement</h1>
      <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
          <label for="nom">Nom </label>
          <input type="text" name="nom" required><br><br>

          <label for="prenom">Prénom </label>
          <input type="text" name="prenom" required><br><br>

          <label for="email">Email </label>
          <input type="text" name="email" required><br><br>

          <label for="idEvenement">ID de l'événement </label>
          <input type="text" name="idEvenement" value="<?php echo isset($_GET['idEvenement']) ? $_GET['idEvenement'] : ''; ?>" readonly><br><br>

          <input type="submit" value="Soumettre">
      </form>
    </div>
    <?php else: ?>
    <div class="qr-code-container">
      <h1 class="qr-code-title">Votre Pass</h1>
      <img class="qr-code-image" src="<?php echo $cheminFichierComplet; ?>" alt="QR code">
      <p class="qr-code-note">Veuillez présenter ce QR code à l'entrée de l'événement</p>
      <p class="qr-code-disclaimer">Ce pass est strictement personnel et non transférable.</p>

      <div class="qr-code-buttons">
        <a class="admin-button2" href="<?php echo $cheminFichierComplet; ?>" download>Télécharger</a>
        <a class="admin-button2" href="#" onclick="window.print()">Imprimer</a>
      </div>
    </div>
    <?php endif; ?>

    <?php
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        // Récupérer les données du formulaire
        $nom = $_POST["nom"];
        $prenom = $_POST["prenom"];
        $email = $_POST["email"];
        $idEvenement = $_POST["idEvenement"];

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

        // Préparation de la requête SQL avec une déclaration préparée
        $sql = "INSERT INTO qr_inscription_data (nom, prenom, email, idEvenement) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssi", $nom, $prenom, $email, $idEvenement);

        // Exécution de la requête préparée
        if ($stmt->execute()) {
            echo "Inscription réussie!";
            // Générer le QR code et afficher les informations
            // ...
        } else {
            echo "Erreur lors de l'inscription: " . $stmt->error;
        }

        // Fermer la connexion à la base de données
        $stmt->close();
        $conn->close();
    }
    ?>
</body>
</html>
