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
    // Traitement des modifications
    // ...
}

// Récupération des événements existants (à remplacer par votre logique de récupération)
$evenements = array(
    array("id" => 1, "nom" => "Événement 1", "description" => "Description de l'événement 1"),
    array("id" => 2, "nom" => "Événement 2", "description" => "Description de l'événement 2"),
    // ...
);

?>

<!DOCTYPE html>
<html>
<head>
    <title>Administration des événements</title>
    <link rel="stylesheet" href="admin.css" type="text/css"/>
</head>
<body>
    <h1>Administration des événements</h1></br></br>

    <h2>Liste des événements</h2>
    <table>
        <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Actions</th>
        </tr>
        <?php foreach ($evenements as $evenement) : ?>
            <tr>
                <td><?php echo $evenement["id"]; ?></td>
                <td><?php echo $evenement["nom"]; ?></td>
                <td><?php echo $evenement["description"]; ?></td>
                <td>
                    <a href="modifier_evenement.php?id=<?php echo $evenement["id"]; ?>">Modifier</a> |
                    <a href="supprimer_evenement.php?id=<?php echo $evenement["id"]; ?>">Supprimer</a>
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

          <input type="submit" value="Ajouter">
        </form>
      </div>
</body>
</html>
