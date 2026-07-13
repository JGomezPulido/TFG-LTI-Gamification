import {BrowserRouter, Routes, Route} from 'react-router-dom';

import {Theme} from "@radix-ui/themes";

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
import BadgePage from './pages/BadgePage';
import { InventoryProvider } from './context/inventoryContext';
import CreateItemPage from './pages/CreateItemPage';
import CreateMissionPage from './pages/CreateMissionPage';
import MissionPage from './pages/MissionPage';
import ItemPage from './pages/ItemPage';
import NavBar from './components/Navbar';
import { MissionProvider } from './context/missionContext';

function ContextProvider({children}){
  return (
    <AuthProvider>
      <CourseProvider>
        <BadgeProvider>
          <InventoryProvider>
            <MissionProvider>
              {children}
            </MissionProvider>
          </InventoryProvider>
        </BadgeProvider>
      </CourseProvider>
    </AuthProvider>
  )
}

function AppRouter(){
  return(
    <BrowserRouter>
    <NavBar>
      <Routes>
        <Route path='/'                                         element={<LandingPage/>}    />
        <Route path='/register'                                 element={<RegisterPage/>}   />
        <Route path='/login'                                    element={<LoginPage/>}      />
        <Route path='/ltiLaunch'                                element={<LTILaunchPage/>}  />

        <Route element={<ProtectedRoute/>} >
          <Route path='/profile/:id'                            element={<ProfilePage/>}    />
            <Route path='/dashboard'                            element={<DashboardPage/>}  />
              <Route path='/course/:course_id'                  element={<CoursePage/>}     />
              <Route path='/course/:course_id/badge/:badge_id'  element={<BadgePage/>}      />
              <Route path='/course/:course_id/item/:item_id'    element={<ItemPage/>}       />
              <Route path='/course/:course_id/mission/:mission_id' element={<MissionPage/>} />
              <Route element={<RoleRoute accepted={"Instructor"}/>}>
                <Route path='course/:course_id/badge/create'    element={<CreateBadgePage/>}/>
                <Route path='course/:course_id/item/create'     element={<CreateItemPage/>} />
                <Route path='course/:course_id/mission/create'  element={<CreateMissionPage/>}/>
              </Route>    
        </Route>
      </Routes>
    </NavBar>
    
    </BrowserRouter>
  )
}

function App() {
  return ( 
    <Theme scaling="110%" accentColor='gray' appearance='dark'>
      <ContextProvider>
        <AppRouter/>
      </ContextProvider>        
    </Theme>
  );
}

export default App;