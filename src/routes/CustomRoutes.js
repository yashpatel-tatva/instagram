import { Navigate, Route, Routes } from "react-router-dom"
import { AllRoutes } from "../constants/AllRoutes"
import { SignUp } from "../pages/signup/Signup"
import { Login } from "../pages/login/Login"
import { Home } from "../pages/home/Home"
import ForgetPassword from "../pages/forgetpassword/ForgetPassword"
import Search from "../pages/search/Search"
import Explore from "../pages/explore/Explore"
import Notification from "../pages/notification/Notification"
import Reels from "../pages/reels/Reels"
import Profile from "../pages/profile/Profile"
import Messages from "../pages/messages/Messages"



export const AuthRoutes = () => {
    return (
        <Routes>
            <Route path="/*" element={<Navigate to={AllRoutes.Login} />} />
            <Route path={AllRoutes.SignUp} element={<SignUp />} />
            <Route path={AllRoutes.Login} element={<Login />} />
            <Route path={AllRoutes.ForgetPassword} element={<ForgetPassword />} />
        </Routes>);
};

export const NormalRoutes = () => {
    return (<Routes>
        <Route path="/*" element={<Navigate to={AllRoutes.Home} />} />
        <Route path={AllRoutes.Home} element={<Home />} />
        <Route path={AllRoutes.Search} element={<Search />} />
        <Route path={AllRoutes.Explore} element={<Explore />} />
        <Route path={AllRoutes.Notification} element={<Notification />} />
        <Route path={AllRoutes.Reels} element={<Reels />} />
        <Route path={AllRoutes.UserProfile} element={<Profile />} />
        <Route path={AllRoutes.Messages} element={<Messages />} />
    </Routes>);
};

