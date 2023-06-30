<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Scanner et vérifier le QR code</title>
  <script src="jsQR\docs\jsQR.js"></script>
  <link href="css\admin.css" rel="stylesheet">
</head>
<body>
  <h1>Scanner et vérifier le QR code</h1>
  <div id="loadingMessage">🎥 Impossible d'accéder au flux vidéo (assurez-vous d'avoir une webcam activée)</div>
  <canvas id="canvas" hidden></canvas>
  <div id="output" hidden>
    <div id="outputMessage">Aucun QR code détecté.</div>
    <div hidden><b>Données :</b></div>
    <div hidden><b>Nom :</b> <span id="outputNom"></span></div>
    <div hidden><b>Prénom :</b> <span id="outputPrenom"></span></div>
    <div hidden><b>Adresse e-mail :</b> <span id="outputEmail"></span></div>
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
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get('id');

    function drawLine(begin, end, color) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    }

    // Utilisez facingMode: "environment" pour essayer d'obtenir la caméra frontale sur les téléphones
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // nécessaire pour indiquer à Safari iOS que nous ne voulons pas le mode plein écran
      video.play();
      requestAnimationFrame(tick);
    });

    function checkQRCodeValidity(data) {
      // Extrayez l'ID d'événement du QR code
      var qrCodeEventId = data.eventId;

      // Comparez l'ID passé dans l'URL avec l'ID du QR code
      if (qrCodeEventId === idParam) {
        return true;
      } else {
        return false;
      }
    }

    function tick() {
      loadingMessage.innerText = "⌛ Chargement de la vidéo..."
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        loadingMessage.hidden = true;
        canvasElement.hidden = false;
        outputContainer.hidden = false;

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
          outputNom.parentElement.hidden = false;
          outputPrenom.parentElement.hidden = false;
          outputEmail.parentElement.hidden = false;
          outputNom.innerText = code.data.nom;
          outputPrenom.innerText = code.data.prenom;
          outputEmail.innerText = code.data.email;
          if (checkQRCodeValidity(code.data)) {
            // Le QR code est valide, faites ce que vous voulez ici
          } else {
            // Le QR code n'est pas valide
          }
        } else {
          outputMessage.hidden = false;
          outputNom.parentElement.hidden = true;
          outputPrenom.parentElement.hidden = true;
          outputEmail.parentElement.hidden = true;
        }
      }
      requestAnimationFrame(tick);
    }
  </script>
</body>
</html>
