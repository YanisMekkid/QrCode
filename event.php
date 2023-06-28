<?php
// Liste des événements (à adapter selon vos besoins)
$evenements = [
    1 => 'Événement 1',
    2 => 'Événement 2',
    3 => 'Événement 3'
];

// Vérifier si un événement a été sélectionné
if (isset($_POST['evenement'])) {
    $evenementId = $_POST['evenement'];

    // Rediriger vers le formulaire d'inscription avec l'ID de l'événement
    header("Location: subscription.php?idEvenement=$evenementId");
    exit();
}
?>
