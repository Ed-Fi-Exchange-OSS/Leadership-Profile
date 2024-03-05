import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import VacancyReport from './components/VacancyReport/VacancyReport';
import IdentifyLeaders from './components/IdentifyLeaders/IdentifyLeaders';
import Directory from './components/DirectoryComponents/Directory';
import LandingPage from './components/LandingPageComponents/LandingPage';
import Profile from "./components/ProfileComponents/Profile";
import Registration from './components/LoginComponents/Registration';
import Login from "./components/LoginComponents/Login";
import ForgotPassword from "./components/LoginComponents/ForgotPassword";
import ResetPassword from './components/LoginComponents/ResetPassword';


const AppRoutes = [
  {
    index: true,
    element: <Login />
  },
  {
    path: '/landing',
    element: <LandingPage />
  },
  {
    path: '/account/login',
    element: <Login />
  },
  {
    path: "/account/forgotpassword",
    element: <ForgotPassword />
  },
  {
    path: "/account/resetpassword",
    element: <ResetPassword /> 
  },
  {
    path: "/account/register",
    element: <Registration />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/vacancy-report',
    element: <VacancyReport />
  },
  {
    path: '/identify-leaders',
    element: <IdentifyLeaders />
  },
  {
    path: '/directory',
    element: <Directory />
  },
  {
    path: '/profile/:id',
    element: <Profile />
  }


];

export default AppRoutes;
