import LandPhoneImg from "../../components/landphoneimg/LandPhoneImg";
import '../../App.css'
import CustomInputField from "../../components/custominputs/CustomInputField";
import instaTextLogo from '../../assets/img/png/instaTextLogo.png'
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { AllRoutes } from '../../constants/AllRoutes'
import appStore from '../../assets/img/png/app-store.png'
import googlePlay from '../../assets/img/png/google-play.png'
import FacebookIcon from '@mui/icons-material/Facebook';
import { useState } from "react";
import { isSignupValid, emailValid, phoneValid, passwordValid, usernameValid, getIdType } from '../../hooks/ValidationHook'


export const SignUp = () => {
    const [emailormobile, setEmailormobile] = useState();
    const [fullname, setFullname] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const [emailormobilestate, setEmailormobileState] = useState();
    const [usernamestate, setUsernamestate] = useState();
    const [passwordstate, setPasswordstate] = useState();
    const [isValidForm, setIsValidForm] = useState(false);


    function emailormobileHandler(value) {
        setEmailormobile(value);
        setEmailormobileState(emailValid(value) || phoneValid(value));
        validForm(value, username, password);
    }
    function fullnameHandler(value) {
        setFullname(value);
    }
    function usernamHandler(value) {
        setUsername(value)
        validForm(emailormobile, value, password)
        setUsernamestate(usernameValid(value))
    }
    function passwordHandler(value) {
        setPassword(value);
        validForm(emailormobile, username, value)
        setPasswordstate(passwordValid(value))
    }

    function validForm(id, username, password) {
        if (!isSignupValid(id, username, password)) {
            setIsValidForm(false);
            return;
        }
        setIsValidForm(true)
    }
    function handleSignup() {
        const data = { id: emailormobile, fullname: fullname, username: username, password: password, type: getIdType(emailormobile) };
        console.log(data)
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <LandPhoneImg />
            <div className="w-5/12 h-screen justify-center md:w-full flex flex-col items-start gap-4 md:items-center ">
                <div className="darkvorder px-12 py-3 md:border-none w-9/12 sm:w-full" style={{ maxWidth: '420px', minWidth: '320px' }}>
                    <div className="flex justify-center">
                        <img src={instaTextLogo} width={'250px'} style={{ margin: '20px 0px' }} alt="" />
                    </div>
                    <div className="text-center">
                        Sign up to see photos and videos from your friends
                    </div>
                    <div className="my-2">
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ textTransform: 'none' }}
                            className="rounded"
                        >
                            <FacebookIcon /> &nbsp; Log in with Facebook
                        </Button>
                    </div>
                    <span className="divider">OR</span>
                    <CustomInputField label={"Phone Number or Email"} type={"text"} onInputChange={emailormobileHandler} iconType={emailormobilestate} />
                    <CustomInputField label={"Full Name"} type={"text"} onInputChange={fullnameHandler} iconType={"none"} />
                    <CustomInputField label={"Username"} type={"text"} onInputChange={usernamHandler} iconType={usernamestate} />
                    <CustomInputField label={"Password"} type={"password"} onInputChange={passwordHandler} iconType={passwordstate} />
                    <div className="my-2">
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ textTransform: 'none' }}
                            className="rounded"
                            disabled={!isValidForm}
                            onClick={handleSignup}
                        >
                            Sign up
                        </Button>
                    </div>
                </div>
                <div className="darkvorder py-3 md:border-none w-9/12 sm:w-full flex items-center justify-center" style={{ maxWidth: '420px', minWidth: '320px' }}>
                    Have an account? <Link style={{ color: '#3A559F' }} to={AllRoutes.Login} replace={true}>&nbsp; Log in</Link>
                </div>
                <div className="w-9/12 sm:w-full flex items-center justify-center" style={{ maxWidth: '420px', minWidth: '320px' }}>Get the app.</div>
                <div className="w-9/12 sm:w-full flex gap-4 items-center justify-center" style={{ maxWidth: '420px', minWidth: '320px' }}>
                    <img src={appStore} width={'40%'} alt="appstore" /><img src={googlePlay} width={'40%'} alt="googleplay" />
                </div>
            </div>
        </div>
    );
};