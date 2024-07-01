// Funktion zum Starten des QR-Code Scanners
async function startQRCodeScanner(videoElement) {
    try {
        // Zugriff auf die Kamera des Geräts
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        videoElement.srcObject = stream; // Videoelement zeigt den Kamera-Stream
    } catch (error) {
        console.error('Error accessing camera:', error); // Fehlerbehandlung
        alert('Error accessing camera. Please allow access to your camera and reload the page.'); // Benutzerhinweis
    }
}

// Funktion zum Scannen des QR-Codes aus dem Video
async function scanQRCodeFromVideo(videoElement) {
    const canvas = document.createElement('canvas'); // Erstellen eines Canvas-Elements
    const ctx = canvas.getContext('2d'); // Holen des 2D-Kontexts
    canvas.width = videoElement.videoWidth; // Setzen der Breite des Canvas
    canvas.height = videoElement.videoHeight; // Setzen der Höhe des Canvas

    return new Promise((resolve) => {
        const interval = setInterval(() => { // Intervall zum regelmäßigen Scannen
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height); // Zeichnen des Video-Frames auf das Canvas
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Extrahieren der Bilddaten
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert', // QR-Code Scannen
            });
            if (code) { // Wenn ein QR-Code erkannt wird
                clearInterval(interval); // Stoppt das Intervall
                resolve(code.data); // Gibt die Daten des QR-Codes zurück
            }
        }, 1000); // Scannt jede Sekunde
    });
}

// Funktion zum Verarbeiten des gescannten QR-Codes
function handleQRCodeScan(result) {
    if (result) {
        const scene = document.querySelector('a-scene'); // Holen der A-Frame Szene
        scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false;'); // Setzen der AR.js Attribute
        alert('QR-Code erkannt: ' + result); // Benutzerhinweis
    } else {
        alert('QR-Code nicht erkannt oder ungültig.'); // Fehlerhinweis
    }
}

// Funktion zum Starten der App
async function startApp() {
    document.getElementById('popup').style.display = 'none'; // Versteckt das Popup
    const videoElement = document.getElementById('scanner-video'); // Holen des Videoelements
    await startQRCodeScanner(videoElement); // Startet den QR-Code Scanner
    const qrCodeData = await scanQRCodeFromVideo(videoElement); // Scannt den QR-Code
    handleQRCodeScan(qrCodeData); // Verarbeitet das Ergebnis des Scans
}
