import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { AllRoutes } from "../constants/AllRoutes";
import { SignUp } from "../pages/signup/Signup";
import { Login } from "../pages/login/Login";
import { Home } from "../pages/home/Home";
import ForgetPassword from "../pages/forgetpassword/ForgetPassword";
import Explore from "../pages/explore/Explore";
import Reels from "../pages/reels/Reels";
import Profile from "../pages/profile/Profile";
import Messages from "../pages/messages/Messages";
import ResetPassword from "../pages/forgetpassword/ResetPassword";
import EditProfile from "../components/editProfile/EditProfile";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<Navigate to={AllRoutes.Login} />} />
      <Route path={AllRoutes.SignUp} element={<SignUp />} />
      <Route path={AllRoutes.Login} element={<Login />} />
      <Route path={AllRoutes.ForgetPassword} element={<ForgetPassword />} />
      <Route path={AllRoutes.ResetPassword} element={<ResetPassword />} />
    </Routes>
  );
};

const OtherProfileWrapper = () => {
  const { userName } = useParams();
  return <Profile key={userName} />;
};

export const NormalRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<Navigate to={AllRoutes.Home} />} />
      <Route path={AllRoutes.Home} element={<Home />} />
      <Route path={AllRoutes.Explore} element={<Explore />} />
      <Route path={AllRoutes.Reels} element={<Reels />} />
      <Route path={AllRoutes.UserProfile} element={<Profile />} />
      <Route path={AllRoutes.Messages} element={<Messages />} />
      <Route path={AllRoutes.EditProfile} element={<EditProfile />} />
      <Route path={AllRoutes.OtherProfile} element={<OtherProfileWrapper />} />
    </Routes>
  );
};
