import {BrowserRouter, Routes, Route} from 'react-router-dom';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CoursePage from './pages/CoursePage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './context/authContext';
function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/dashboard/:user_id' element={<DashboardPage/>}/>
      <Route path='/course/:course_id' element={<CoursePage/>}/>
      <Route path='/profile/:user_id' element={<ProfilePage/>}/>
      <Route path='/badges' element={<div>Lista de Badges conseguidas</div>}/>
      <Route badge='/badge/:badge_id' element={<div>Vista de una Badge en particular</div>}/>
      <Route path='/createBadge' element={<div>Creación de Badges</div>}/>
    </Routes>
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;