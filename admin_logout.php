<?php
// Démarre la session
session_start();

// Détruit toutes les variables de session
session_unset();

// Détruit la session
session_destroy();

// Redirige vers la page de connexion
header("Location: admin-login.php");
exit;
?>
