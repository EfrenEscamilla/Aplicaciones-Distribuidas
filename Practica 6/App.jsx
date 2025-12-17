import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useState } from 'react' // 1. Importamos el hook para manejar el estado

function App() {
  // 2. Inicializamos el contador en 0
  const [count, setCount] = useState(0)

  return (
    // Mantenemos tu estilo contenedor
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Hola, React</h1>
      <p>Esta es mi primera aplicación en React.</p>

      {/* 3. Agregamos el botón del contador aquí */}
      {/* Le agregué un pequeño margen arriba (marginTop) para separarlo del texto */}
      <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }} onClick={() => setCount(count + 1)}>
        El contador es: {count}
      </button>
    </div>
  )
}

export default App