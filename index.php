<?php include("event.php"); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Acceuil</title>
    <link rel="stylesheet" href="style.css" type="text/css"/>
</head>
<body>
  
  <a class="admin-button" href="admin-login.php">Connexion administrateur</a>

    <h1>Sélectionnez un événement </h1>
    <div class="event-list">
        <?php foreach ($evenements as $id => $nom) : ?>
            <div class="event-card">
                <h2><?php echo $nom; ?></h2>
                <p>Description de l'événement...</p>
                <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                    <input type="hidden" name="evenement" value="<?php echo $id; ?>">
                    <input type="submit" value="Inscription">
                </form>
            </div>
        <?php endforeach; ?>
    </div>

</body>
</html>
