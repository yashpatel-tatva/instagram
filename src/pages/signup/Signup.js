import LandPhoneImg from "../../components/landphoneimg/LandPhoneImg";
import "../../App.css";
import CustomInputField from "../../components/custominputs/CustomInputField";
import instaTextLogo from "../../assets/img/png/instaTextLogo.png";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AllRoutes } from "../../constants/AllRoutes";
import appStore from "../../assets/img/png/app-store.png";
import googlePlay from "../../assets/img/png/google-play.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useEffect, useState } from "react";
import {
  isSignupValid,
  emailValid,
  phoneValid,
  passwordValid,
  usernameValid,
  getIdType,
} from "../../hooks/ValidationHook";
import { useDispatch } from "react-redux";
import {
  login,
  signup,
  useSelectorUserState,
} from "../../redux/slices/AuthSlice";
import { LoadingButton } from "@mui/lab";
import ErrorModal from "../../components/errormodal/ErrorModal";
// import PasswordChecklist from "react-password-checklist"

export const SignUp = () => {
  const [email, setEmail] = useState();
  const [mobile, setMobile] = useState();
  const [fullname, setFullname] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState("");

  const [emailstate, setEmailState] = useState();
  const [mobilestate, setMobileState] = useState();
  const [usernamestate, setUsernamestate] = useState();
  const [emailstateerror, setEmailStateerror] = useState();
  const [mobilestateerror, setMobileStateerror] = useState();
  const [usernamestateerror, setUsernamestateerror] = useState();
  const [passwordstate, setPasswordstate] = useState();
  const [isValidForm, setIsValidForm] = useState(false);

  const { ErrorMessage, isError, success, loading } = useSelectorUserState();

  const dispatch = useDispatch();

  function emailHandler(value) {
    setEmail(value);
    setEmailState(emailValid(value));
    validForm(value, mobile, username, password);
  }
  function mobileHandler(value) {
    setMobile(value);
    setMobileState(phoneValid(value));
    validForm(email, value, username, password);
  }
  function fullnameHandler(value) {
    setFullname(value);
  }
  function usernamHandler(value) {
    setUsername(value);
    validForm(email, mobile, value, password);
    setUsernamestate(usernameValid(value));
    if (!usernameValid(value)) {
      setUsernamestateerror(
        "UserName must have atleast 7 charater and can contain [A-Z][a-z][0-9][._]"
      );
    } else {
      setUsernamestateerror();
    }
  }
  function passwordHandler(value) {
    setPassword(value);
    validForm(email, mobile, username, value);
    setPasswordstate(passwordValid(value));
  }

  function validForm(email, mobile, username, password) {
    if (!isSignupValid(email, mobile, username, password)) {
      setIsValidForm(false);
      return;
    }
    setIsValidForm(true);
  }
  async function handleSignup() {
    const data = {
      email: email,
      contactNumber: mobile,
      name: fullname,
      userName: username,
      password: password,
      type: getIdType(email),
    };
    const res = await dispatch(signup(data));
    if (!res.payload.isSuccess) {
      setMobileStateerror(
        res.payload.data.find(
          (elemnet) => elemnet.reference === "mobileNumber"
        ) &&
          res.payload.data.find(
            (elemnet) => elemnet.reference === "mobileNumber"
          ).message
      );
      setEmailStateerror(
        res.payload.data.find((elemnet) => elemnet.reference === "Email") &&
          res.payload.data.find((elemnet) => elemnet.reference === "Email")
            .message
      );
      setUsernamestateerror(
        res.payload.data.find((elemnet) => elemnet.reference === "username") &&
          res.payload.data.find((elemnet) => elemnet.reference === "username")
            .message
      );
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      //   dispatch(
      //     login({
      //       userId: email,
      //       password: password,
      //       typeUserId: getIdType(email),
      //     })
      //   );
      navigate(AllRoutes.Login);
    }
  }, [success]);

  return (
    <div className="flex items-center justify-center h-screen">
      <LandPhoneImg />
      <div className="w-5/12 h-screen justify-center md:w-full flex flex-col items-start gap-4 md:items-center ">
        <div
          className="darkvorder px-12 py-3 md:border-none w-9/12 sm:w-full"
          style={{ maxWidth: "420px", minWidth: "320px" }}
        >
          <div className="flex justify-center">
            <img
              src={instaTextLogo}
              width={"250px"}
              style={{ margin: "20px 0px" }}
              alt=""
            />
          </div>
          <div className="text-center">
            Sign up to see photos and videos from your friends
          </div>
          <div className="my-2">
            <Button
              variant="contained"
              fullWidth
              sx={{ textTransform: "none" }}
              className="rounded"
            >
              <FacebookIcon /> &nbsp; Log in with Facebook
            </Button>
          </div>
          <span className="divider">OR</span>
          <span className="text-red-500">{emailstateerror}</span>
          <CustomInputField
            label={"Email"}
            type={"text"}
            onInputChange={emailHandler}
            iconType={emailstate}
          />
          <span className="text-red-500">{mobilestateerror}</span>
          <CustomInputField
            label={"Phone Numeer"}
            type={"text"}
            onInputChange={mobileHandler}
            iconType={mobilestate}
          />
          <CustomInputField
            label={"Full Name"}
            type={"text"}
            onInputChange={fullnameHandler}
            iconType={"none"}
          />
          <span className="text-red-500">{usernamestateerror}</span>
          <CustomInputField
            label={"Username"}
            type={"text"}
            onInputChange={usernamHandler}
            iconType={usernamestate}
          />
          <CustomInputField
            label={"Password"}
            type={"password"}
            onInputChange={passwordHandler}
            iconType={passwordstate}
          />
          {password.length !== 0 && !passwordstate && (
            // <PasswordChecklist
            //     rules={["minLength", "specialChar", "number", "capital", "lowercase"]}
            //     minLength={7}
            //     value={password}
            //     onChange={() => { }}
            // />
            <span className="text-red-600">
              (Password should be 'Abc@1' Format with 7 characters)
            </span>
          )}
          {/* {isError && (
            <div className="text-center">
              <ErrorModal open={true} message={ErrorMessage} />
            </div>
          )} */}
          <div className="my-2">
            <LoadingButton
              loading={loading}
              variant="contained"
              fullWidth
              sx={{ textTransform: "none" }}
              className="rounded"
              disabled={!isValidForm}
              onClick={handleSignup}
            >
              Sign up
            </LoadingButton>
          </div>
        </div>
        <div
          className="darkvorder py-3 md:border-none w-9/12 sm:w-full flex items-center justify-center"
          style={{ maxWidth: "420px", minWidth: "320px" }}
        >
          Have an account?{" "}
          <Link
            style={{ color: "#3A559F" }}
            to={AllRoutes.Login}
            replace={true}
          >
            &nbsp; Log in
          </Link>
        </div>
        <div
          className="w-9/12 sm:w-full flex items-center justify-center"
          style={{ maxWidth: "420px", minWidth: "320px" }}
        >
          Get the app.
        </div>
        <div
          className="w-9/12 sm:w-full flex gap-4 items-center justify-center"
          style={{ maxWidth: "420px", minWidth: "320px" }}
        >
          <img src={appStore} width={"40%"} alt="appstore" />
          <img src={googlePlay} width={"40%"} alt="googleplay" />
        </div>
      </div>
    </div>
  );
};
