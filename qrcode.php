<?php
// Configuration de la connexion à la base de données (à adapter selon vos paramètres)
$serveur = "localhost";
$utilisateur = "root";
$motDePasse = "test";
$nomBaseDeDonnees = "qrcode";

// Fonction de connexion à la base de données
function connecterBDD() {
    global $serveur, $utilisateur, $motDePasse, $nomBaseDeDonnees;
    $connexion = new mysqli($serveur, $utilisateur, $motDePasse, $nomBaseDeDonnees);
    if ($connexion->connect_error) {
        die("Erreur de connexion à la base de données : " . $connexion->connect_error);
    }
    return $connexion;
}

$qrCodeGenere = false;

// Vérifier si le formulaire a été soumis
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérer les données du formulaire
    $nom = $_POST["nom"];
    $prenom = $_POST["prenom"];
    $idEvenement = $_POST["idEvenement"];
    $email = $_POST["email"];


    // Enregistrer les données dans la base de données
    $connexion = connecterBDD();
    if (!$connexion) {
      die("Erreur de connexion à la base de données : " . mysqli_connect_error());
    }

    $requete = $connexion->prepare("INSERT INTO qr_inscription_data (Nom, Prenom, idEvenement, email) VALUES (?, ?, ?, ?)");

    if (!$requete) {
      die("Erreur de préparation de la requête : " . $connexion->error);
    }

    $requete->bind_param('ssss', $nom, $prenom, $idEvenement, $email);
    $requete->execute();
    $requete->close();

    $sql = "SELECT IdCode FROM qr_inscription_data WHERE Nom = ? AND Prenom = ? AND idEvenement = ? AND email = ?";
    $requete = $connexion->prepare($sql);
    $requete->bind_param("ssis", $nom, $prenom, $idEvenement, $email);
    $requete->execute();
    $resultat = $requete->get_result();
    $IdCode = $resultat->fetch_assoc()["IdCode"];
    $requete->close();



    // Générer le QR code
    require_once 'phpqrcode/qrlib.php';
    $passAcces = [
        'nom' => $nom,
        'prenom' => $prenom,
        'email' => $email,
        'idEvenement' => $idEvenement,
        'IdCode' =>$IdCode
    ];
    $jsonPassAcces = json_encode($passAcces);
    $contenuQRCode = urlencode($jsonPassAcces);
    $cheminFichierQRCode = 'qr_codes/';
    $nomFichierQRCode = 'pass_acces_' . $idEvenement . '_' . $email . '.png';
    $cheminFichierComplet = $cheminFichierQRCode . $nomFichierQRCode;
    QRcode::png($contenuQRCode, $cheminFichierComplet, QR_ECLEVEL_L, 10, 2);

    $qrCodeGenere = true;

    // Affichage du QR code
    //echo '<img src="' . $cheminFichierComplet . '" alt="QR code">';
}
?>
