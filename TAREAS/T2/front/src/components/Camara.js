import React, { useRef, useEffect } from 'react';

const Camara = ({ isOpen, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let stream = null;

    const enableStream = async () => {
      try {
        if (isOpen && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error al acceder a la cámara: ", err);
      }
    };

    enableStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  let fechaActual = new Date().toDateString();
  const sendImageToApi = (imageData) => {
    const apiUrl = 'http://localhost:4000/guardarFoto';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ foto:imageData,fechaCreacion:fechaActual}),
    })
    .then(response => response.json())
    .then(() => {
      alert("Foto tomada ;)")
    })
    .catch((error) => {
      alert("Ocurrio un erro :(")
    });
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      sendImageToApi(imageData);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: '640px', height: '480px', backgroundColor: 'white', padding: '20px' }}>
        <video ref={videoRef} width="450" height="250" autoPlay></video>
        <button className='btn btn-success' onClick={takePhoto}>Tomar Foto</button>
        <button className='btn btn-danger' onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px' }}><i className="bi bi-x"></i></button>
      </div>
      <canvas ref={canvasRef} width="450" height="250" style={{display: 'none'}}></canvas>
    </div>
  );
};

export default Camara;