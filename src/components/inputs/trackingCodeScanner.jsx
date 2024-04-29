import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';

const CaptureImageAndScan = () => {
  const [scannedText, setScannedText] = useState('');
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef();

  const startCapture = () => {
    setCapturing(true);
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((error) => {
        console.error('Erro ao acessar a câmera:', error);
      });
  };

  const stopCapture = () => {
    setCapturing(false);
    if (videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      Tesseract.recognize(blob, 'eng')
        .then(({ data: { text } }) => {
          setScannedText(text);
        })
        .catch((error) => {
          console.error('Erro ao escanear a imagem:', error);
        });
    }, 'image/jpeg');
    stopCapture();
  };

  return (
    <div>
      {!capturing && (
        <button onClick={startCapture}>Capturar imagem da câmera</button>
      )}
      {capturing && (
        <div>
          <video ref={videoRef} style={{ maxWidth: '100%', marginBottom: '20px' }} />
          <button onClick={captureImage}>Capturar imagem</button>
          <button onClick={stopCapture}>Cancelar</button>
        </div>
      )}
      {scannedText && (
        <div>
          <p>Texto escaneado: {scannedText}</p>
          <button onClick={() => setScannedText('')}>Limpar texto</button>
        </div>
      )}
    </div>
  );
};

export default CaptureImageAndScan;
