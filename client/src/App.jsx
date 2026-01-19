import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/home' element={<div>App</div>}></Route>
      <Route path='/profile/:id' element={<div>App</div>}></Route>
      <Route path='/badges/:id' element={<div>App</div>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
