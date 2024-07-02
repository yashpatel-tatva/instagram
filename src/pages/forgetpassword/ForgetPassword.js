import React, { useEffect, useState } from "react";
import "../../App.css";
import CustomInputField from "../../components/custominputs/CustomInputField";
import instaTextLogo from "../../assets/img/png/instaTextLogo.png";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AllRoutes } from "../../constants/AllRoutes";
import LockSvg from "../../assets/img/svgIcons/locksvg.svg";
import { getIdType, isIdValid } from "../../hooks/ValidationHook";
import { useDispatch } from "react-redux";
import {
  authAction,
  forgetpassword,
  useSelectorUserState,
} from "../../redux/slices/AuthSlice";
import { LoadingButton } from "@mui/lab";
import ErrorModal from "../../components/errormodal/ErrorModal";
import Swal from "sweetalert2";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [id, setId] = useState();
  const [isValid, setIsValid] = useState(false);

  const { loading, success, isError, ErrorMessage } = useSelectorUserState();

  function idhandler(value) {
    setId(value);
    validform(value);
  }
  function validform(id) {
    setIsValid(isIdValid(id));
  }
  async function handleSendLink() {
    const data = { emailOrNumberOrUserName: id, type: getIdType(id) };
    await dispatch(forgetpassword(data));
  }
  useEffect(() => {
    if (success) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Check Your Mail",
        showConfirmButton: false,
        timer: 1500,
      });
      dispatch(authAction.resetSuccess());
      navigate(AllRoutes.Login);
    }
  });
  return (
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
              <div
                className="rounded-full flex"
                style={{
                  border: "2px solid black",
                  width: "30%",
                  padding: "5%",
                }}
              >
                <img src={LockSvg} alt=""></img>
              </div>
            </div>
            <div className="flex justify-center my-4">Trouble logging in </div>
            <div className="text-center text-slate-400 text-sm">
              Enter your email, phone, or username and we'll send you a link to
              get back into your account.
            </div>
            <div className="my-3">
              <CustomInputField
                label={"Phone , Email or Username"}
                type={"text"}
                onInputChange={idhandler}
              />
            </div>
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
                disabled={!isValid}
                onClick={handleSendLink}
              >
                Send link For Reset Password
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
  );
};

export default ForgetPassword;
