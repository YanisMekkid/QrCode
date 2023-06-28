<?php include("qrcode.php"); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Formulaire d'inscription et génération de QR code</title>
    <link rel="stylesheet" href="style.css" type="text/css"/>
</head>
<body>
   <?php if (!$qrCodeGenere): ?>
    <div class = "form-container">
      <h1>Inscription à l'événement</h1>
      <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
          <label for="nom">Nom </label>
          <input type="text" name="nom" required><br><br>

          <label for="penom">Prenom </label>
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
      <p class="qr-code-note">Veuillez présenter ce QR code à l'entrée de l'Evenement</p>
      <p class="qr-code-disclaimer">Ce pass est strictement personnel et non transférable.</p>
    </div>

  <?php endif; ?>
</body>
</html>
