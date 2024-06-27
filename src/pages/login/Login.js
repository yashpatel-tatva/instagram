import LandPhoneImg from "../../components/landphoneimg/LandPhoneImg";
import '../../App.css'
import CustomInputField from "../../components/custominputs/CustomInputField";
import instaTextLogo from '../../assets/img/png/instaTextLogo.png'
import { Button } from "@mui/material";
import facebook from '../../assets/img/png/facebook.png'
import { Link, useNavigate } from "react-router-dom";
import { AllRoutes } from '../../constants/AllRoutes'
import appStore from '../../assets/img/png/app-store.png'
import googlePlay from '../../assets/img/png/google-play.png'
import { useState } from "react";
import { isLoginValid, getIdType } from '../../hooks/ValidationHook'
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/AuthSlice";

export const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isValidtoLogin, setIsValidtoLogin] = useState(false)
    const [password, setPassword] = useState();
    const [id, setId] = useState();
    function passwordHandler(value) {
        setPassword(value);
        validform(id, value)
    }
    function idhandler(value) {
        setId(value);
        validform(value, password)
    }
    function validform(id, password) {
        setIsValidtoLogin(isLoginValid(id, password))
    }

    async function handleLogin() {
        const data = { userId: id, password: password, typeUserId: getIdType(id) };
        const res = await dispatch(login(data));
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <LandPhoneImg />
            <div className="w-5/12 h-screen justify-center md:w-full flex flex-col items-start gap-4 md:items-center ">
                <div className="darkvorder px-12 py-3 md:border-none w-9/12 sm:w-full" style={{ maxWidth: '420px', minWidth: '320px' }}>
                    <div className="flex justify-center">
                        <img src={instaTextLogo} style={{ margin: '20px 0px' }} width={'250px'} alt="" />
                    </div>
                    <CustomInputField label={"Phone Number , Email or Username"} type={"text"} onInputChange={idhandler} />
                    <CustomInputField label={"Password"} type={"password"} onInputChange={passwordHandler} />
                    <div className="my-2">
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ textTransform: 'none' }}
                            className="rounded"
                            disabled={!isValidtoLogin}
                            onClick={handleLogin}
                        >
                            Log in
                        </Button>
                    </div>
                    <span className="divider">OR</span>
                    <div className="mt-4 mb-3 flex items-center justify-center gap-4" style={{ color: '#3A559F' }}>
                        <img src={facebook} width={'8%'} alt="" /> Log in with Facebook
                    </div>
                    <div className="mt-4 mb-3 flex items-center justify-center gap-4" style={{ color: '#3A559F', fontSize: 'small' }}>
                        <Link to={AllRoutes.ForgetPassword} >Forget Password?</Link>
                    </div>
                </div>
                <div className="darkvorder py-3 md:border-none w-9/12 sm:w-full flex items-center justify-center" style={{ maxWidth: '420px', minWidth: '320px' }}>
                    Don't have an account? <Link style={{ color: '#3A559F' }} to={AllRoutes.SignUp} replace={true}>&nbsp; Sign Up</Link>
                </div>
                <div className="w-9/12 sm:w-full flex items-center justify-center" style={{ maxWidth: '420px', minWidth: '320px' }}>Get the app.</div>
                <div className="w-9/12 sm:w-full flex gap-4 items-center justify-center" style={{ maxWidth: '420px', minWidth: '320px' }}>
                    <img src={appStore} width={'40%'} alt="" /><img src={googlePlay} width={'40%'} alt="" />
                </div>
            </div>
        </div>
    );
};