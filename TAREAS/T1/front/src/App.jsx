import { useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState({
    nombre: "",
    carnet: ""
  });

  const clickMostrar = async () => {
    try {
      const response = await fetch('http://localhost:2074/data');
      if (!response.ok) {
        throw new Error('La solicitud no pudo ser completada');
      }
      const jsonData = await response.json();
      setData(jsonData)
    } catch (error) {
      console.error(error);
    }
  }

  if (data.nombre) {
    return (
      <>
        <div>
          <div> Tarea1 - SO1 - 1S2024  </div>
          <div> { new Date().toString() } </div>
        </div>
        <div>
          <label> {data.nombre} </label>
        </div>
        <div>
          <label> {data.carnet} </label>
        </div>
      </>
    )
  } else {
    return (<button onClick={clickMostrar} > Mostrar </button>)
  }
}

export default App
