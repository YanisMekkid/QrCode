<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Scanner et vérifier le QR code</title>
  <script src="jsQR/docs/jsQR.js"></script>
  <link href="css/admin.css" rel="stylesheet">
</head>
<body>
  <a class="admin-button2" href="admin-page.php">Administration</a>
  <h1>Scanner et vérifier le QR code</h1>
  <div id="loadingMessage">🎥 Impossible d'accéder au flux vidéo (assurez-vous d'avoir une webcam activée)</div>
  <canvas id="canvas" hidden></canvas>
  <div id="output" hidden>
    <div id="outputMessage"></div>
    <div hidden><b>Données :</b></div>
    <div hidden><b>Nom :</b> <span id="outputNom"></span></div></br>
    <div hidden><b>Prénom :</b> <span id="outputPrenom"></span></div></br>
    <div hidden><b>Adresse e-mail :</b> <span id="outputEmail"></span></div></br></br>
    <div hidden><b> <span id="outputIdCode"></span></b></div>
  </div>
  <script>
    var video = document.createElement("video");
    var canvasElement = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");
    var loadingMessage = document.getElementById("loadingMessage");
    var outputContainer = document.getElementById("output");
    var outputMessage = document.getElementById("outputMessage");
    var verificationMessage = document.getElementById("verificationMessage");
    var outputNom = document.getElementById("outputNom");
    var outputPrenom = document.getElementById("outputPrenom");
    var outputEmail = document.getElementById("outputEmail");
    var outputIdCode = document.getElementById("outputIdCode");
    var lastScanTime = Date.now();
    var resetTimeout = 5000; // Durée d'attente avant de réinitialiser les données (en millisecondes)
    var IdCodeArray = [];
    var scanPaused = false; // Variable pour vérifier si le scan est en pause
    var IdCodeVerif = false;
    var Status = "";

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
      outputIdCode.innerText = "";
    }

    var popupWindow;

    function openPopupWindow(data, IdCodeVerif,Status) {
      var popupWidth = 400;
      var popupHeight = 400;
      var left = window.screen.width / 2 - popupWidth / 2;
      var top = window.screen.height / 2 - popupHeight / 2;
      var features = `width=${popupWidth},height=${popupHeight},top=${top},left=${left},resizable=no`;

      popupWindow = window.open("", "_blank", features);
      
      if (IdCodeVerif === true){
        popupWindow.document.write(`
          <html>
          <head>
            <title>QR Code Scanné</title>
            <link href="css/popup.css" rel="stylesheet">
            <style>
            span{
              top: 10px;
              left: 160px;
              display: inline-block;
              padding: 10px 20px;
              color: #0FD673;
              text-decoration: none;
              border-radius: 3px;
              border: none;
              font-size: 16px;
            }

            </style>
          </head>
          <body>
            <h2>Données scannées :</h2>
            <div><b>Nom :</b> ${data.nom}</div>
            <div><b>Prénom :</b> ${data.prenom}</div>
            <div><b>Adresse e-mail :</b> ${data.email}</div></br>
            <div><b>QR CODE DÉJÀ VÉRIFIÉ</b></div>
            ${Status}
            <button onclick="window.close()">Fermer</button>
          </body>
          </html>
        `);
      } else {
        popupWindow.document.write(`
          <html>
          <head>
            <title>QR Code Scanné</title>
            <link href="css/popup.css" rel="stylesheet">
          </head>
          <body>
            <h2>Données scannées :</h2>
            <div><b>Nom :</b> ${data.nom}</div>
            <div><b>Prénom :</b> ${data.prenom}</div>
            <div><b>Adresse e-mail :</b> ${data.email}</div>
            ${Status}
            <button onclick="window.close()">Fermer</button>
          </body>
          </html>
        `);
      }
      popupWindow.addEventListener("beforeunload", function() {
        scanPaused = false;
      });
      popupWindow.focus();
    }

    function tick() {
      loadingMessage.innerText = "⌛ Chargement de la vidéo..."
      if (video.readyState === video.HAVE_ENOUGH_DATA && !scanPaused) {
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


          var QrCodeValidity = false;

          if (IdCodeArray.includes(parsedData.IdCode)) {
            //outputIdCode.innerText = "QR CODE DÉJÀ VÉRIFIÉ";
            IdCodeVerif = true;
          } else {
            IdCodeArray.push(parsedData.IdCode);
          }

          // Vérifier la validité du QR code
          if (checkQRCodeValidity(parsedData)) {
            // Le QR code est valide, afficher les données
            outputNom.innerText = parsedData.nom;
            outputPrenom.innerText = parsedData.prenom;
            outputEmail.innerText = parsedData.email;

            Status = "<div class='valide'>VALIDE</div></br></br>"

            // Réinitialiser le compteur de temps
            lastScanTime = Date.now();

            // Ouvrir la popup avec les données scannées
            openPopupWindow(parsedData, IdCodeVerif,Status);

            // Mettre en pause le scan
            video.pause();
            scanPaused = true;

          } else {
            // Le QR code n'est pas valide, afficher les données même lorsque c'est refusé
            outputNom.innerText = parsedData.nom;
            outputPrenom.innerText = parsedData.prenom;
            outputEmail.innerText = parsedData.email;

            Status = "<div class='invalide'>INVALIDE</div></br></br>"

            // Réinitialiser le compteur de temps
            lastScanTime = Date.now();
            // Ouvrir la popup avec les données scannées
            openPopupWindow(parsedData, IdCodeVerif,Status);

            // Mettre en pause le scan
            video.pause();
            scanPaused = true;
          }
          video.play();
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

    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get('id'); // Remplacez 'id' par le nom du paramètre dans l'URL

    // Vérifiez si l'ID est présent dans l'URL
    if (idParam) {
      // L'ID est présent, utilisez sa valeur
      idParam = idParam.trim(); // Supprimez les espaces avant et après l'ID
    } else {
      // L'ID n'est pas présent dans l'URL, faites le traitement approprié
      // Par exemple, affichez un message d'erreur ou utilisez une valeur par défaut
      idParam = "1"; // Valeur par défaut si l'ID n'est pas présent dans l'URL
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // nécessaire pour indiquer à Safari iOS que nous ne voulons pas le mode plein écran
      video.play();
      requestAnimationFrame(tick);
    });
  </script>
</body>
</html>
