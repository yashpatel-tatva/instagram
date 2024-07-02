import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CustomInputField from "../../components/custominputs/CustomInputField";
import { AllRoutes } from "../../constants/AllRoutes";
import instaTextLogo from "../../assets/img/png/instaTextLogo.png";
import PasswordChecklist from "react-password-checklist";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  authAction,
  resetpassword,
  useSelectorUserState,
} from "../../redux/slices/AuthSlice";
import { LoadingButton } from "@mui/lab";
import ErrorModal from "../../components/errormodal/ErrorModal";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [passvalid, setpassvalid] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success, isError, ErrorMessage } = useSelectorUserState();

  function handleResetPassword() {
    const data = {
      encyptUserId: id,
      password: password,
      confirmPassword: passwordAgain,
    };
    dispatch(resetpassword(data));
  }

  useEffect(() => {
    if (success) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Login with new password",
        showConfirmButton: false,
        timer: 1500,
      });
      dispatch(authAction.resetSuccess());
      navigate(AllRoutes.Login);
    }
  });

  return (
    <div>
      <div className="h-screen">
        <div className="w-screen flex textlogodiv">
          <img
            src={instaTextLogo}
            style={{ margin: "10px 0px" }}
            alt="Instagram"
            width={"150px"}
          ></img>
        </div>
        <hr style={{ height: "2px" }} />
        <div className="flex w-screen justify-center items-center mt-12">
          <div
            className="darkvorder  justify-center items-center md:border-none w-9/12 sm:w-full"
            style={{ maxWidth: "420px", minWidth: "320px" }}
          >
            <div className="px-12 py-6 sm:px-8">
              <div className="flex justify-center items-center">
                <div className="text-center">
                  <p className="font-bold mb-4">Create A Strong Password</p>
                  <span className="text-slate-400 ">
                    Your password must be at least 6 characters and should
                    include a combination of numbers, letters and special
                    characters (!$@%).
                  </span>
                </div>
              </div>
              <div className="my-3">
                <CustomInputField
                  label={"New Password"}
                  type={"password"}
                  onInputChange={(value) => {
                    setPassword(value);
                  }}
                />
                <CustomInputField
                  label={"New Password, again"}
                  type={"password"}
                  onInputChange={(value) => {
                    setPasswordAgain(value);
                  }}
                />
              </div>
              {(password.length !== 0 || passwordAgain.length !== 0) && (
                <PasswordChecklist
                  rules={[
                    "minLength",
                    "specialChar",
                    "number",
                    "capital",
                    "match",
                  ]}
                  minLength={5}
                  value={password}
                  valueAgain={passwordAgain}
                  onChange={(isValid) => {
                    setpassvalid(true);
                  }}
                />
              )}
              {isError && (
                <div className="text-center">
                  <ErrorModal open={true} message={ErrorMessage} />
                </div>
              )}
              <div className="my-3">
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  fullWidth
                  sx={{ textTransform: "none" }}
                  className="rounded"
                  disabled={!passvalid}
                  onClick={handleResetPassword}
                >
                  Reset Password
                </LoadingButton>
              </div>
              <div className="text-center text-sky-500 text-sm mb-6">
                <a href="https://help.instagram.com/374546259294234">
                  Can't reset your password?
                </a>
              </div>
              <span className="divider mb-3">OR</span>
              <div className="text-center mb-3">
                <Link to={AllRoutes.SignUp}>Create new account</Link>
              </div>
            </div>
            <div className="borderlogin md:border-none w-full customizefooter">
              <Link to={AllRoutes.Login} replace={true}>
                <Button
                  style={{
                    backgroundColor: "#0000000a",
                    width: "100%",
                    color: "#00000094",
                  }}
                >
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
