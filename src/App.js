import { useDispatch } from "react-redux";
import "./App.css";
import SideBottomBar from "./layouts/SideBottomBar";
import { authAction, useSelectorUserState } from "./redux/slices/AuthSlice";
import { AuthRoutes, NormalRoutes } from "./routes/CustomRoutes";
import { useEffect } from "react";
import {
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
} from "react-router-dom";
import { AllRoutes } from "./constants/AllRoutes";
import ResetPassword from "./pages/forgetpassword/ResetPassword";
import { userAction } from "./redux/slices/UserActionSlice";
import { isExpired } from "react-jwt";
import { setNavigate } from "./helpers/axiousinstance";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(dispatch);
  }, [dispatch]);

  const { isLoggedIn } = useSelectorUserState();
  const token = localStorage.getItem("token");
  if (!!token) {
    if (isExpired(token)) {
      dispatch(authAction.logout());
    }
  }
  const location = useLocation();
  const isResetPasswordRoute = useMatch(AllRoutes.ResetPassword);
  useEffect(() => {
    dispatch(authAction.resetErrors());
    dispatch(userAction.resetProfileUpdateFlag());
    dispatch(userAction.resetErrors());
    dispatch(userAction.resetNotification());
  }, [location.pathname, dispatch]);

  return (
    <>
      {isResetPasswordRoute ? (
        <Routes>
          <Route path={AllRoutes.ResetPassword} element={<ResetPassword />} />
        </Routes>
      ) : (
        <>
          {!isLoggedIn ? (
            <AuthRoutes />
          ) : (
            <SideBottomBar>
              <NormalRoutes />
            </SideBottomBar>
          )}
        </>
      )}
      {/* {!isLoggedIn ? (
        <AuthRoutes />
      ) : (
        <>
          <Routes>
            <Route path={AllRoutes.ResetPassword} element={<ResetPassword />} />
          </Routes>
          {!isResetPasswordRoute && (
            <SideBottomBar>
              <NormalRoutes />
            </SideBottomBar>
          )}
        </>
      )} */}
    </>
  );
}

export default App;
