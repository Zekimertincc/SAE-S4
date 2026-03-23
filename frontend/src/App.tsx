import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VisitorForm from './pages/VisitorForm'
import Confirmation from './pages/Confirmation'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VisitorForm />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
