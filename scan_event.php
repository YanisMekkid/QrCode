<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Scanner et vérifier le QR code</title>
  <script src="jsQR/docs/jsQR.js"></script>
  <link href="css/admin.css" rel="stylesheet">
</head>
<body>
  <h1>Scanner et vérifier le QR code</h1>
  <div id="loadingMessage">🎥 Impossible d'accéder au flux vidéo (assurez-vous d'avoir une webcam activée)</div>
  <canvas id="canvas" hidden></canvas>
  <div id="output" hidden>
    <div id="outputMessage">Aucun QR code détecté.</div>
    <div hidden><b>Information :</b></div>
    <div ><b>Nom :</b> <span id="outputNom"></span></div>
    <div ><b>Prénom :</b> <span id="outputPrenom"></span></div>
    <div ><b>Adresse e-mail :</b> <span id="outputEmail"></span></div>
  </div>
  <script>
    var video = document.createElement("video");
    var canvasElement = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");
    var loadingMessage = document.getElementById("loadingMessage");
    var outputContainer = document.getElementById("output");
    var outputMessage = document.getElementById("outputMessage");
    var outputNom = document.getElementById("outputNom");
    var outputPrenom = document.getElementById("outputPrenom");
    var outputEmail = document.getElementById("outputEmail");
    var lastScanTime = Date.now();
    var resetTimeout = 5000; // Durée d'attente avant de réinitialiser les données (en millisecondes)

    function drawLine(begin, end, color) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    }

    function checkQRCodeValidity(data) {
      // Extraire l'ID d'événement du QR code
      var qrCodeEventId = data.idEvenement;

      // Comparer l'ID passé dans l'URL avec l'ID du QR code
      if (qrCodeEventId === idParam) {
        return true;
      } else {
        return false;
      }
    }

    function resetData() {
      outputNom.innerText = "";
      outputPrenom.innerText = "";
      outputEmail.innerText = "";
      outputContainer.hidden = true;
    }

    function tick() {
      loadingMessage.innerText = "⌛ Chargement de la vidéo..."
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        loadingMessage.hidden = true;
        canvasElement.hidden = false;
        outputMessage.hidden = false;

        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
          outputMessage.hidden = true;
          outputContainer.hidden = false;

          // Décoder l'URL et analyser la chaîne JSON
          var decodedData = decodeURIComponent(code.data);
          var parsedData = JSON.parse(decodedData);

          // Vérifier la validité du QR code
          if (checkQRCodeValidity(parsedData)) {
            // Le QR code est valide, afficher les données
            outputNom.innerText = parsedData["nom"];
            outputPrenom.innerText = parsedData["prenom"];
            outputEmail.innerText = parsedData["email"];

            // Réinitialiser le compteur de temps
            lastScanTime = Date.now();
          } else {
            // Le QR code n'est pas valide, réinitialiser les données
            resetData();
          }
        } else {
          // Vérifier si le délai d'attente est écoulé depuis le dernier scan
          var currentTime = Date.now();
          if (currentTime - lastScanTime >= resetTimeout) {
            // Aucun QR code détecté pendant le délai d'attente, réinitialiser les données
            resetData();
          }
        }
      }
      requestAnimationFrame(tick);
    }

    var idParam = "1"; // Remplacez cela par l'ID passé dans l'URL
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // nécessaire pour indiquer à Safari iOS que nous ne voulons pas le mode plein écran
      video.play();
      requestAnimationFrame(tick);
    });
  </script>
</body>
</html>
