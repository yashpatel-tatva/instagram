import { useDispatch } from "react-redux";
import "./App.css";
import SideBottomBar from "./layouts/SideBottomBar";
import { authAction, useSelectorUserState } from "./redux/slices/AuthSlice";
import { AuthRoutes, NormalRoutes } from "./routes/CustomRoutes";
import { useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useMatch,
} from "react-router-dom";
import { AllRoutes } from "./constants/AllRoutes";
import ResetPassword from "./pages/forgetpassword/ResetPassword";

function App() {
  const { isLoggedIn } = useSelectorUserState();
  const dispatch = useDispatch();
  const location = useLocation();

  // useEffect(() => {
  //   if (!isLoggedIn) return;
  //   dispatch(authAction.setuser());
  // }, [dispatch, isLoggedIn]);
  const isResetPasswordRoute = useMatch(AllRoutes.ResetPassword);
  console.log(isResetPasswordRoute);
  useEffect(() => {
    dispatch(authAction.resetErrors());
  }, [location.pathname]);

  return (
    <>
      {!isLoggedIn ? (
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
      )}
    </>
  );
}

export default App;
