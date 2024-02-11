import { useState, useEffect } from 'react'
import './App.css'
import Camara from './components/Camara'

function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photoPool, setPhotoPool] = useState([]);

  const handleOpenCamera = () => setIsCameraOpen(true);

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
    fetchPhotoCount();
  };

  const fetchPhotoCount = async () => {
    try {
      const response = await fetch('http://localhost:4000/obtenerFotos');
      const data = await response.json();
      setPhotoPool(data);
    } catch (error) {
      console.error("Error al obtener las fotos:", error);
    }
  };

  useEffect(() => {
    fetchPhotoCount();
  }, []);
  return (
    <div className='p-5'>
      <div className='row'>

        <div className='col text-start mb-2'>
          <h1 className='tituloApp col text-primary-emphasis'>Tomar Foto con Cámara Web <button className='btn btn-success ms-5' onClick={handleOpenCamera}>Abrir Cámara</button></h1>
        </div>
      </div>
      <Camara isOpen={isCameraOpen} onClose={handleCloseCamera} />
      <div key={"contieneTodo"}>
        {
          photoPool.length ?
            (
              <div key={"contenedor"} className="text-center">
                <div key={"filas"} className="row">
                  {
                    photoPool.map((item, index) => {
                      //const fecha = new Date(item.fecha);
                      //const fecha_formateada = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second:'2-digit', hourCycle:'h12' })
                      return (
                        <div key={index} className="col-sm-12 col-md-6 col-lg-4 mb-5">
                          <label htmlFor={item._id} className='fw-bold text-primary-emphasis'> Fecha: <small> {item.fechaCreacion} </small> </label> <br />
                          <img id={item._id} src={item.foto} alt={item.fechaCreacion} />
                        </div>
                      )
                    }
                    )
                  }
                </div>
              </div>
            ) :
            (<h3 className='text-warning text-center pt-5'> No hay fotos que mostrar :( </h3>)
        }
      </div>
    </div>
  );
}

export default App
