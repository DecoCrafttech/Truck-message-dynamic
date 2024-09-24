import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../Services/axiosInstance';
import { updateIsLoggedIn, updateUserDetails } from '../../Storage/Slices/LoginSlice';
import Cookie from 'js-cookie';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import Autocomplete from "react-google-autocomplete";
import { IoIosMail } from "react-icons/io";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import validator from 'validator'

const Navbar = () => {
    const Login = useSelector((state) => state.login);
    const dispatch = useDispatch();
    const pageRender = useNavigate();

    const publicUrl = process.env.PUBLIC_URL + '/';

    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [pincode, setPincode] = useState('');
    const [password, setPassword] = useState('');
    const [termsChecked, setTermsChecked] = useState(false);
    const [passwordEye, setPasswordEye] = useState(false);
    const [signinLoading, setSignInLoading] = useState(false);
    const [forgotPassMobNumVerification, setforgotPassMobNumVerification] = useState(false);
    const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
    const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false);
    const [resendCountDown, setResendCountDown] = useState(null);

    const [otpInput, setOtpInput] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [step, setStep] = useState(1);
    const [firstName, setFirstName] = useState('');
    const [dob, setDob] = useState('');
    const [category, setCategory] = useState('')

    const [operatingStates, setOperatingStates] = useState([])
    const [operatingStateString, setoperatingStateString] = useState('')
    const [operatingStateStringdupli, setoperatingStateStringdupli] = useState('')
    const [checked, setChecked] = useState(false);

    const [forgotPassMobNum, setForgotPassMobNum] = useState('');
    const [forgotPasswordStep, setForgotPasswordStep] = useState(Number);
    const [forgotPassUSerId, setforgotPassUSerId] = useState('')

    const [errorMessage, setErrorMessage] = useState(false)

    const validate = (value) => {
        if (validator.isStrongPassword(value, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            setErrorMessage(false)
        } else {
            setErrorMessage(true)
        }
    }

    const handleReset = () => {
        setPasswordEye(false)
        setResendCountDown(null)
        setUpdatePasswordLoading(false)
        setVerifyOtpLoading(false)
    }

    const handleResetAllFields = () => {
        setErrorMessage(false)
        setPassword('')
        setConfirmPassword('')
        setFirstName('')
        setDob('')
        setCategory('')
        setPhoneNumber('')
        setEmail('')
        setPincode('')
    }

    const [updatePass, setUpdatePass] = useState({
        password: '',
        confirm_password: ''
    })

    const [otp, setOtp] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [window.location.pathname])

    useEffect(() => {
        const isUserExist = Cookie.get("usrin")
        if (isUserExist) {
            dispatch(updateIsLoggedIn(true));
        } else {
            dispatch(updateIsLoggedIn(false));
        }
    }, [])

    const signIn = async () => {
        if (phoneNumber === '' || password === '') {
            toast.error('Please fill in all fields.');
        } else if (!termsChecked) {
            toast.error('Please agree to the terms and conditions.');
        } else {
            setSignInLoading(true)
            try {
                const loginData = {
                    username: phoneNumber,
                    password: password
                }
                const res = await axiosInstance.post('/login', loginData)
                if (res.data.error_code === 0) {
                    const userId = window.btoa(res.data.data[0].id);
                    var date = new Date();
                    date.setDate(date.getDate() + 1);

                    //updating username in cookies
                    Cookie.set("usrin", userId, {
                        expires: date, // 1 day
                        secure: true,
                        sameSite: 'strict',
                        path: '/'
                    })

                    dispatch(updateIsLoggedIn(true));
                    document.getElementById("closeSignInModel").click();
                }
                setSignInLoading(false)
            } catch (err) {
                toast.error(err.code)
            }
        }
    };

    const register = async () => {
        try {
            if (firstName === '' || dob === '' || phoneNumber === '' || category === '' || password === '' || confirmPassword === '' || pincode.length === 0) {
                toast.error('Please fill in all fields.');
                return;
            } else if (password !== confirmPassword) {
                toast.error('Passwords and confirm password does not match.');
                return;
            } else if (!termsChecked) {
                toast.error('You must agree to the terms and conditions.');
                return;
            }

            else if (pincode.length !== 6) {
                toast.error('Pin code should be 6 digit');
                return;
            }

            const registrationData = {
                first_name: firstName,
                date_of_birth: dob,
                category: category, // Assuming the state variable holds the category
                state: operatingStates,
                phone_number: phoneNumber,
                password: password,
                operating_city: [],
                email: email,
                pincode: pincode
            };

            const res = await axios.post('https://truck.truckmessage.com/registration', registrationData)
            if (res.data.error_code === 0) {
                if (res.data.success) {
                    toast.success(res.data.message)

                    sendOTP(phoneNumber); // Send OTP after successful registration
                    setStep(2); // Move to step 2 after registration
                } else {
                    document.getElementById("registrationModalClose").click()
                    toast.error(res.data.message)
                }
            }
        } catch (err) {
            toast.error(err.code)
        }
    };

    useEffect(() => {
        if (resendCountDown === 0) {
            setResendCountDown(null);
        }

        if (!resendCountDown) return;

        const intervalId = setInterval(() => {
            setResendCountDown(resendCountDown - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [resendCountDown]);



    const sendOTP = async (phone) => {
        try {
            await axiosInstance.post('/send_signup_otp', { phone_number: phone })
        } catch (err) {
            toast.error(err.code)
        }
    };

    const validateOTP = async () => {
        try {
            if (otpInput === '') {
                toast.error('Please enter OTP.');
                return;
            }

            setVerifyOtpLoading(true)
            const otpData = {
                phone_number: phoneNumber,
                otp: otpInput
            };

            const res = await axios.post('https://truck.truckmessage.com/validate_otp', otpData);
            if (res.data.error_code === 1) {
                toast.success(res.data.message)

                document.getElementById("registrationModalClose").click();
            } else {
                toast.error(res.data.message)
            }
            setVerifyOtpLoading(false)
        } catch (err) {
            console.log(err)
        }
    };

    const handlePhoneNumberInput = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
        setPhoneNumber(e.target.value);
    };

    const handleLogOut = () => {
        Cookie.remove("usrin");
        dispatch(updateIsLoggedIn(false));
    }

    useEffect(() => {
        if (operatingStateStringdupli !== '') {
            operatingStates[operatingStates.length] = operatingStateStringdupli
            setOperatingStates(operatingStates)
            setoperatingStateString("")
            setoperatingStateStringdupli("")
        }
    }, [operatingStateStringdupli])

    const handleVerifyMobileNumbre = async () => {
        if (forgotPassMobNum !== '') {
            if (forgotPassMobNum.length === 10) {
                setforgotPassMobNumVerification(true);

                try {
                    const data = {
                        phone_number: forgotPassMobNum
                    }
                    const res = await axios.post('https://truck.truckmessage.com/send_forgot_pwd_otp', data)

                    if (res.data.error_code === 0) {
                        setResendCountDown(60)

                        setForgotPasswordStep(2)
                        setforgotPassUSerId(res.data.data.user_id)
                        toast.success(res.data.message)
                    } else {
                        toast.error(res.data.message)
                    }
                    setforgotPassMobNumVerification(false);
                }
                catch (err) {
                    console.log(err)
                }
            } else {
                toast.error("phone number should must be 10 characters")
            }
        } else {
            toast.error("Invalid mobile number")
        }
    }

    const handleVerifyOtp = async () => {
        if (otp !== '' && otp.length === 6) {
            try {
                const data = {
                    phone_number: forgotPassMobNum,
                    otp: otp,
                    user_id: JSON.stringify(forgotPassUSerId)
                }
                const res = await axios.post('https://truck.truckmessage.com/validate_forgot_otp', data)

                if (res.data.error_code === 0) {
                    setForgotPasswordStep(3)
                    toast.success(res.data.message)
                } else {
                    toast.error(res.data.message)
                }
            }
            catch (err) {
                console.log(err)
            }
        } else {
            toast.error("Invalid otp")
        }
    }

    const handleVerifyPasswords = async () => {
        if (updatePass.password !== '' || updatePass.confirm_password !== '') {
            if (updatePass.password === updatePass.confirm_password) {
                setUpdatePasswordLoading(true)
                try {
                    const data = {
                        user_id: JSON.stringify(forgotPassUSerId),
                        pwd_type: "forgot_pwd",
                        new_pwd: updatePass.password
                    }
                    const res = await axios.post('https://truck.truckmessage.com/update_user_password', data)

                    if (res.data.error_code === 0) {
                        document.getElementById('closeForgotPasswordModel').click()
                        toast.success(res.data.message)
                    } else {
                        toast.error(res.data.message)
                    }
                    setUpdatePasswordLoading(false)
                }
                catch (err) {
                    console.log(err)
                }
            } else {
                toast.error("password/confirm password does not match")
            }
        } else {
            toast.error("password/confirm password is empty")
        }
    }

    const dynamicForgotPassword = () => {
        switch (forgotPasswordStep) {
            case 1:
                return <div className="modal-content">
                    <div className="modal-header border-0 ">
                        <h1 className="modal-title fs-5 " id="staticBackdropLabel">Forgot password</h1>
                        <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" id="closeForgotPasswordModel"></button>
                    </div>
                    <div className="modal-body">
                        <section>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mx-auto p-3 pb-0 pt-2 border-0" style={{ maxWidth: '520px' }}>
                                        <div className="card-body py-5">
                                            <div className="form-group">
                                                <label>Phone Number</label>
                                                <input type="number" max={10} className="form-control py-3" placeholder="Phone number" value={forgotPassMobNum} onChange={(e) => setForgotPassMobNum(e.target.value)} />
                                            </div>
                                            {
                                                forgotPassMobNumVerification ?
                                                    <button type="button" className="btn btn-primary btn-block pe-none" >
                                                        <div class="spinner-border text-light" role="status">
                                                            <span class="visually-hidden">Loading...</span>
                                                        </div>
                                                    </button>
                                                    :
                                                    <button type="button" className="btn btn-primary btn-block" onClick={handleVerifyMobileNumbre}>Verify</button>
                                            }

                                        </div>
                                    </div>
                                    <div className='mt-1 ps-4'>
                                        <p>
                                            Remember your password?
                                            <a href="#" data-bs-toggle="modal" data-bs-target="#loginModal" onClick={() => {
                                                document.getElementById("closeForgotPasswordModel").click()
                                                setPasswordEye(false)
                                            }}> Sign in</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

            case 2:
                return <div className="modal-content">
                    <div className="modal-header border-0 ">
                        <h1 className="modal-title fs-5 " id="staticBackdropLabel">Verify OTP</h1>
                        <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" id="closeForgotPasswordModel"></button>
                    </div>
                    <div className="modal-body">
                        <section>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mx-auto p-3 pb-0 pt-2 border-0" style={{ maxWidth: '520px' }}>
                                        <div className="card-body py-5">
                                            <div className="form-group">
                                                <label>OTP</label>
                                                <input type="number" max={6} className="form-control py-3" placeholder="Enter otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
                                            </div>

                                            <div className='text-end mb-3'>
                                                <span className='pe-2'>{resendCountDown ? `00:${resendCountDown}` : '00:00'} </span>
                                                <a className={`text-decoration-underline ${resendCountDown !== null ? 'pe-none' : 'cursor-pointer'}`} onClick={resendCountDown !== null ?
                                                    null : () => {
                                                        setResendCountDown(60)
                                                        sendOTP(phoneNumber)
                                                    }}>
                                                    resend otp
                                                </a>
                                            </div>

                                            <button type="button" className="btn btn-primary btn-block" onClick={handleVerifyOtp}>Verify otp</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

            case 3:
                return <div className="modal-content">
                    <div className="modal-header border-0 ">
                        <h1 className="modal-title fs-5 " id="staticBackdropLabel">Change Password</h1>
                        <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" id="closeForgotPasswordModel"></button>
                    </div>
                    <div className="modal-body">
                        <section>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mx-auto p-3 pb-0 pt-2 border-0" style={{ maxWidth: '520px' }}>
                                        <div className="card-body py-5">
                                            <div className="form-group">
                                                <label>password</label>
                                                <input type="text" className="form-control" placeholder="Password" value={updatePass.password} onChange={(e) => setUpdatePass({ ...updatePass, password: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label>Confirm password</label>
                                                <input type="password" className="form-control" placeholder="Confirm Password" value={updatePass.confirm_password} onChange={(e) => setUpdatePass({ ...updatePass, confirm_password: e.target.value })} />
                                            </div>
                                            {
                                                updatePasswordLoading ?
                                                    <button type="button" className="btn btn-primary btn-block pe-none" >
                                                        <div class="spinner-border text-light" role="status">
                                                            <span class="visually-hidden">Loading...</span>
                                                        </div>
                                                    </button>
                                                    :
                                                    <button type="button" className="btn btn-primary btn-block" onClick={handleVerifyPasswords}>Update password</button>
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

            default:
                break;
        }
    }



    return (
        <>
            <div>
                <header className="ltn__header-5 ltn__header-transparent--- gradient-color-4---">
                    <div className="ltn__header-top-area section-bg-6 top-area-color-white---">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <div className="ltn__top-bar-menu text-start  ">
                                        <ul>
                                            <li className='fs-4  '>
                                                <a className=' mailtext' href="mailto:info@webmail.com?Subject=Flower%20greetings%20to%20you">
                                                <IoIosMail className='me-2' />
                                                info@truckmessage.com
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                
                            </div>
                        </div>
                    </div>


                    <div className="ltn__header-middle-area ltn__header-sticky ltn__sticky-bg-white py-3">
                        <div className="container">
                            <div className="row">
                                <div className="col-5 col-md-4 col-lg-4 col-xl-3">
                                    <div className="site-logo-wrap mb-0 w-100">
                                        <div className="site-logo go-top w-100">
                                            <Link to="/"><img src={publicUrl + "assets/img/truckmessage.png"} alt="truck message Logo - All in one truck solutions" /></Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className='ltn__header-options ltn__header-options-2 mb-sm-20 justify-content-end align-items-center mb-0'>
                                        {
                                            Login.isLoggedIn ?
                                                <>
                                                    <div className="dropdown dropdown m-0 h-100">
                                                        <div className="dropdown col-12 text-center" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <img className='user-icon-width btn ltn__utilize-toggle p-0 shadow' src='https://static.vecteezy.com/system/resources/previews/005/005/788/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg' alt="profile logo" />
                                                        </div>
                                                        <ul className="dropdown-menu dropdown-menu-lg-end">
                                                            <li className='m-0' onClick={() => pageRender("my_profile")}><button className="dropdown-item" type="button">My account</button></li>
                                                            <li className='m-0' onClick={() => pageRender("wishlist/load")}><button className="dropdown-item" type="button">My post</button></li>
                                                            <li className='m-0' onClick={() => pageRender("chat")}><button className="dropdown-item" type="button">Enquiry</button></li>
                                                            <li className='m-0' onClick={handleLogOut}><button className="dropdown-item" type="button">Log out</button></li>
                                                        </ul>
                                                    </div>
                                                </>
                                                :
                                                <div className="ltn__drop-menu user-menu">
                                                    <ul>
                                                        <li>
                                                            <button type='button' className='btn btn-sm btn-danger' data-bs-toggle="modal" data-bs-target="#loginModal" title="Login">
                                                                <span className="tooltip">Login</span>
                                                                Login
                                                            </button>
                                                        </li>
                                                        <li className='ms-3'>
                                                            <button type='button' className='btn btn-sm btn-danger' data-bs-toggle="modal" data-bs-target="#registerModal" title="Sign Up" onClick={() => {
                                                                setStep(1)
                                                                handleResetAllFields()
                                                            }}>
                                                                <span className="tooltip">Register</span>
                                                                Register
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>


                <div id="ltn__utilize-mobile-menu" className="ltn__utilize ltn__utilize-mobile-menu">
                    <div className="ltn__utilize-menu-inner ltn__scrollbar">
                        <div className="ltn__utilize-menu-head">
                            <div className="site-logo">
                                <Link to="/"><img src={publicUrl + "assets/img/logo.png"} alt="Logo" /></Link>
                            </div>
                            <button className="ltn__utilize-close">×</button>
                        </div>

                        <div className="ltn__utilize-buttons ltn__utilize-buttons-2">
                            <ul>
                                {Login.isLoggedIn && (
                                    <li>
                                        <Link to="/my-account" title="My Account">
                                            <span className="utilize-btn-icon">
                                                <i className="far fa-user" />
                                            </span>
                                            My Account
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* login modal  */}
            <div className="modal fade" id="loginModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0 ">
                            <h1 className="modal-title fs-5 " id="staticBackdropLabel">Login</h1>
                            <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" id="closeSignInModel"></button>
                        </div>
                        <div className="modal-body">
                            <section>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="card mx-auto p-3 pb-0 pt-2 border-0" style={{ maxWidth: '520px' }}>
                                            <div className="card-body">
                                                <div className="form-group">
                                                    <label>Phone Number</label>
                                                    <input type="text" className="form-control" placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                                </div>
                                                <div className="form-group position-relative">
                                                    <label>Password</label>
                                                    <input type={passwordEye ? "text" : "password"} className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                    <div className='signin-password-eye'>
                                                        {
                                                            passwordEye ?
                                                                <button type="button" className='btn py-3' onClick={() => setPasswordEye(!passwordEye)}><AiOutlineEye className='fs-4' /></button>
                                                                :
                                                                <button type="button" className='btn py-3' onClick={() => setPasswordEye(!passwordEye)}><AiOutlineEyeInvisible className='fs-4' /></button>
                                                        }
                                                    </div>

                                                    <div className='text-end w-100'>
                                                        <a href="#" data-bs-toggle="modal" data-bs-target="#forgotpasswordModel" onClick={() => {
                                                            setForgotPasswordStep(1)
                                                            document.getElementById("closeSignInModel").click()
                                                        }}>Forgot password ?</a>
                                                    </div>
                                                </div>
                                                <div className="form-group form-check">
                                                    <input type="checkbox" className="form-check-input" id="termsCheck" checked={termsChecked} onChange={() => setTermsChecked(!termsChecked)} />
                                                    <label className="form-check-label ps-2" htmlFor="termsCheck">I agree to the terms and conditions</label>
                                                </div>
                                                {
                                                    signinLoading ?
                                                        <button type="button" className="btn btn-primary btn-block pe-none" >
                                                            <div class="spinner-border text-light" role="status">
                                                                <span class="visually-hidden">Loading...</span>
                                                            </div>
                                                        </button>
                                                        :
                                                        <button type="button" className="btn btn-primary btn-block" onClick={signIn}>Sign In</button>
                                                }

                                                <div className='mt-4'>
                                                    <p>
                                                        Dont have an account ?
                                                        <a href="#" data-bs-toggle="modal" data-bs-target="#registerModal" onClick={() => { document.getElementById("closeSignInModel").click() }}> Register</a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>


            {/* forgot password modal  */}
            <div className="modal fade" id="forgotpasswordModel" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    {dynamicForgotPassword()}
                </div>
            </div>

            {/* register modal  */}
            <div className="modal fade" id="registerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className={`modal-dialog ${step === 2 ? "modal-md" : "modal-lg"} modal-dialog-centered modal-dialog-scrollable`}>
                    <div className="modal-content">
                        <div className="modal-header border-0">
                            <h1 className="modal-title fs-5  " id="staticBackdropLabel">Registration</h1>
                            <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" id="registrationModalClose"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-lg-12 p-2 border-0">
                                    <div className="col-12 border-0">
                                        <form className="card-body">
                                            {/* <h4 className="card-title mb-4">Registration</h4> */}
                                            <div id="step1" className={`col-12 ${step === 1 ? 'd-flex flex-wrap' : 'd-none'}`}>
                                                <div className="form-group col-12 col-md-6 mb-3">
                                                    <label className='mb-1'>Name</label>
                                                    <input type="text" className="form-control mb-0" placeholder="Enter Your Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                                </div>

                                                <div className="form-group col-12 col-md-6 mb-3">
                                                    <label>Date of Birth</label>
                                                    <input type="date" className="form-control py-3 mb-0" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
                                                </div>
                                                <div className="form-group mb-3 col-12 col-md-6">
                                                    <label>Email</label>
                                                    <div className="input-group ">
                                                        <input type="email" className="form-control py-3 mb-0" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                    </div>
                                                </div>

                                                <div className="form-group mb-3 col-12 col-md-6">
                                                    <label>Pincode</label>
                                                    <div className="input-group ">
                                                        <input type="text" className="form-control py-3 mb-0" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} maxLength="6" />
                                                    </div>
                                                </div>

                                                <div className="form-group mb-3 col-12 col-md-6">
                                                    <label>Phone Number</label>
                                                    <div className="input-group ">
                                                        <div className="input-group-prepend d-flex">
                                                            <span className="input-group-text py-3">+91</span>
                                                        </div>
                                                        <input type="tel" className="form-control py-3 mb-0" placeholder="Phone number" value={phoneNumber} onInput={handlePhoneNumberInput} maxLength="10" />
                                                    </div>
                                                </div>

                                                <div className="col">
                                                    <h6>Category</h6>
                                                    <button type="button" class="btn btn-transparent border shadow-none dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                                                        {category === '' ? 'select Category' : category}
                                                    </button>
                                                    <ul class="dropdown-menu col-11">
                                                        <li onClick={() => setCategory('Lorry Owner')} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Lorry Owner</a></li>
                                                        <li onClick={() => setCategory('Logistics')} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Logistics</a></li>
                                                        <li onClick={() => setCategory('Lorry Contractors')} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Lorry Contractors</a></li>
                                                        <li onClick={() => setCategory('Load Booking Agent')} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Load Booking Agent</a></li>
                                                        <li onClick={() => setCategory('Driver')} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Driver</a></li>
                                                        <li onClick={() => setCategory('Lorry Buy & Sell Dealer/Owner')} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Lorry Buy & Sell Dealer/Owner</a></li>
                                                    </ul >
                                                </div>

                                                <div className="form-group mb-3 col-12 col-md-6">
                                                    <label>Password</label>
                                                    <input type="password" className="form-control mb-0" placeholder="Password" value={password} onChange={(e) => {
                                                        setPassword(e.target.value)
                                                        validate(e.target.value)
                                                    }} />

                                                    {errorMessage ? <span className='text-danger'>
                                                        Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character
                                                    </span>
                                                        :
                                                        null
                                                    }
                                                </div>
                                                <div className="form-group mb-3 col-12 col-md-6">
                                                    <label>Confirm Password</label>
                                                    <input type="password" className="form-control mb-0" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                                </div>
                                                <div className="form-group form-check col-12">
                                                    <input type="checkbox" className="form-check-input" id="termsCheck" checked={termsChecked} onChange={() => setTermsChecked(!termsChecked)} />
                                                    <label className="form-check-label" htmlFor="termsCheck">I agree to the terms and conditions</label>
                                                </div>
                                                <button type="button" className="btn btn-primary btn-block" onClick={register} aria-label="Register">Register</button>

                                                <div className='mt-4'>
                                                    <p>
                                                        Already have an account ?
                                                        <a href="#" data-bs-toggle="modal" data-bs-target="#loginModal" onClick={() => {
                                                            document.getElementById("registrationModalClose").click()
                                                            handleReset()
                                                        }}> Sign in</a>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Step 2: Enter OTP */}
                                            <div id="step2" style={{ display: step === 2 ? 'block' : 'none' }}>
                                                <div className="form-group">
                                                    <label>Enter OTP</label>
                                                    <input type="text" className="form-control" placeholder="Enter OTP" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} />
                                                </div>

                                                <div className='text-end mb-3'>
                                                    <span className={`pe-2 ${resendCountDown > 0 ? "" : "d-none"}`}>{resendCountDown ? `00:${resendCountDown}` : '00:00'} </span>
                                                    <a className={`text-decoration-underline ${resendCountDown !== null ? 'pe-none' : 'cursor-pointer'}`} onClick={resendCountDown !== null ?
                                                        null : () => {
                                                            setResendCountDown(60)
                                                            sendOTP(phoneNumber)
                                                        }}>
                                                        resend otp
                                                    </a>
                                                </div>

                                                {
                                                    verifyOtpLoading ?
                                                        <button type="button" className="btn btn-primary btn-block pe-none" >
                                                            <div class="spinner-border text-light" role="status">
                                                                <span class="visually-hidden">Loading...</span>
                                                            </div>
                                                        </button>
                                                        :
                                                        <button type="button" className="btn btn-primary btn-block" onClick={validateOTP} aria-label="Send OTP">Verify OTP</button>
                                                }

                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
    // }
}

export default Navbar;
