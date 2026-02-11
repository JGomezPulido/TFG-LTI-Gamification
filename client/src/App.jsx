import {BrowserRouter, Routes, Route} from 'react-router-dom';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CoursePage from './pages/CoursePage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import LTILaunchPage from './pages/LTILaucnhPage';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import { BadgeProvider } from './context/badgeContext';
import { CourseProvider } from './context/courseContext';
import CreateBadgePage from './pages/CreateBadgePage';
function App() {
  return ( 
    <AuthProvider>
      <CourseProvider>
        <BadgeProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LandingPage/>}/>
            <Route path='/register' element={<RegisterPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/ltiLaunch' element={<LTILaunchPage/>}/>

            <Route element={<ProtectedRoute/>} >
                <Route path='/profile' element={<ProfilePage/>}/>
                <Route path='/dashboard' element={<DashboardPage/>}/>
                  <Route badge='/badge/:badge_id' element={<div>Vista de una Badge en particular</div>}/>
                  <Route path='/course/:course_id' element={<CoursePage/>}/>
                  <Route element={<RoleRoute accepted={"Instructor"}/>}>
                    <Route path='course/:course_id/badge/create'     element={<CreateBadgePage/>}/>
                    <Route path='course/:course_id/badge/delete/:id' element={<div>Creación de Badges</div>}/>
                    <Route path='course/:course_id/badge/update/:id' element={<div>Creación de Badges</div>}/>
                    <Route path='course/:course_id/badge/award/:id'  element={<div>Creación de Badges</div>}/>
                  </Route>
                </Route>
          </Routes>
        </BrowserRouter>
        </BadgeProvider>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;