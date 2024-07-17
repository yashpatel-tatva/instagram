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
import { storylisttoshow, userAction } from "./redux/slices/UserActionSlice";
import { isExpired } from "react-jwt";
import { setNavigate } from "./helpers/axiousinstance";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(dispatch);
  }, [dispatch]);
  const { userid } = useSelectorUserState();

  useEffect(() => {
    const myTask = () => {
      const data = {
        pageNumber: 1,
        pageSize: 100,
        searchName: "",
        model: {
          userId: userid,
        },
      };
      dispatch(storylisttoshow(data));
    };
    myTask();
    const intervalId = setInterval(myTask, 20000);
    return () => clearInterval(intervalId);
  }, []);

  const { isLoggedIn } = useSelectorUserState();
  const token = localStorage.getItem("token");
  if (!!token) {
    if (isExpired(token)) {
      dispatch(authAction.logout());
      dispatch(userAction.logout());
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
