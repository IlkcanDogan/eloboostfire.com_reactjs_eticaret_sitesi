/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useContext, useState, useEffect } from 'react'
import { NavLink } from "react-router-dom";
import './style.css';
import Button from '../../components/button';
import firebase from 'firebase';
import { withRouter, Redirect } from 'react-router'
import app from '../../../core/base';
import { AuthContext } from '../../../core/auth';
//import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import $ from 'jquery';

function Navbar(props, { history }) {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [registerPanelOpen, setRegisterPanelOpen] = useState(false);
    const [forgotPanelOpen, setForgotPanelOpen] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', passwordc: '', errorMessage: '', wait: true })
    const [loginAndRoute, setLoginAndRoute] = useState(false);
    const emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    
    //#region handles
    const handleLogin = useCallback(
        async event => {
            if (formData.email && formData.password) {
                setFormData({...formData, wait: true});
                try {
                    await app.auth().signInWithEmailAndPassword(formData.email, formData.password).then((user) => {
                        if(user.user.emailVerified){
                            setLoginAndRoute(true)
                        }
                        else{
                            setFormData({ ...formData, wait: false, errorMessage: '* Please verify your account.' })
                        }
                    })
                }
                catch (error) {
                    setFormData({ ...formData, errorMessage: '* Email or password is incorrect.' })
                }
            }
            else {
                setFormData({ ...formData, errorMessage: '* Please type email and password.' })
            }
        },
    )
    
    const handleRegister = useCallback(
        async event => {
            if(formData.email && formData.password && formData.passwordc){
                if(formData.password.length >= 6) {
                     if(formData.password === formData.passwordc) {
                       if(emailPattern.test(formData.email)){
                            setFormData({...formData, wait: true});
                            try {
                                await app.auth().createUserWithEmailAndPassword(formData.email, formData.password).then((user) => {
                                    app.auth().currentUser.sendEmailVerification().then(() => {
                                        setFormData({...formData, wait: false, password: '', passwordc: '', errorMessage: ''})
                                        window.$('#login-modal').modal('hide');
                                        window.$('#success-register-modal').modal('show');
                                    })
                                })
                            } catch (error) {
                                setFormData({ ...formData, wait: false, errorMessage: '* ' + error.message })
                            }
                       }
                       else {
                            setFormData({ ...formData, errorMessage: '* The email address is badly formatted.' })
                       }
                     }
                     else {
                         setFormData({ ...formData, errorMessage: '* Password does not match.' })
                     }
                }
                else {
                     setFormData({ ...formData, errorMessage: '* Password should be at least 6 characters.' })
                }
             }
             else {
                 setFormData({ ...formData, errorMessage: '* Please do not leave blank.' })
             }
        }
    )

    const handleForgotPassword = useCallback (
        async event => {
            if(formData.email){
                setFormData({...formData, wait: true});
                await app.auth().sendPasswordResetEmail(formData.email).then((user) => {
                    window.$('#login-modal').modal('hide');
                    window.$('#success-reset-modal').modal('show');
                    setFormData({...formData, wait: false});
                }).catch((error) => {
                    setFormData({ ...formData, wait: false, errorMessage: '* Email address not found.'})
                })
            }
            else {
                setFormData({ ...formData, errorMessage: '* Please type email.' })
            }
        }
    )
    //#endregion

    useEffect(() => {
        $(window).scroll(function () {
            $('nav').toggleClass('scrolled', $(this).scrollTop() > 50);
        });
        if(!props.isAccountPage){
            //document.body.scrollTop = 0;
            //document.documentElement.scrollTop = 0;
        }
        
    })

    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
        if (props.mode !== 'private') {
            if (!props.isAccountPage) {
                window.$('#login-modal').modal('hide');
                return <Redirect to='/account' />
            }
            else {
                $('.modal-backdrop').remove();
            }
        }

        if (loginAndRoute) {
            window.$('#login-modal').modal('hide');
            return <Redirect to='/account' />
        }
        $('.rcw-widget-container').remove();
    }

    const uiConfig = {
        signInFlow: "popup",
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccess: () => {
                setLoginAndRoute(true);
            }
        }
    }

    const handleLoginModalOpen = () => {
        setRegisterPanelOpen(false);
        setForgotPanelOpen(false);
        setFormData({ email: '', password: '', passwordc: '', errorMessage: '', wait: false });
    }



    return (
        <>
            <div className="modal fade" id="success-reset-modal" role="dialog" aria-labelledby="success-reset-modal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content" style={{ border: 'none', backgroundColor: 'transparent' }}>
                        <div className="modal-body" id="login-container">
                            <div className="container">
                                <div className="row mt-1">
                                    <div className="col-12">
                                        <form id="login-form">
                                            <center>
                                                <i className="fa fa-check-circle fa-5x" aria-hidden="true" style={{color: '#FFC732'}}></i><br /><br/>
                                                <label style={{fontSize: 18}}>
                                                    Check your inbox for the next steps. If you don't receive an email, 
                                                    and it's not in your spam folder this could mean you signed up with 
                                                    a different address.
                                                </label>
                                            </center>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="success-register-modal" role="dialog" aria-labelledby="success-register-modal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content" style={{ border: 'none', backgroundColor: 'transparent' }}>
                        <div className="modal-body" id="login-container">
                            <div className="container">
                                <div className="row mt-1">
                                    <div className="col-12">
                                        <form id="login-form">
                                            <center>
                                                <i className="fa fa-check-circle fa-5x" aria-hidden="true" style={{color: '#FFC732'}}></i><br /><br/>
                                                <label style={{fontSize: 18}}>Please check your email ({formData.email}) to confirm your account.</label>
                                            </center>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="login-modal" role="dialog" aria-labelledby="login-modal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content" style={{ border: 'none', backgroundColor: 'transparent' }}>
                        <div className="modal-body" id="login-container">
                            {
                                forgotPanelOpen ? (
                                    <div className="container">
                                        <div className="row mt-1">
                                            <div className="col-12">
                                                <form id="login-form">
                                                    <div className="form-group">
                                                        <label htmlFor="email">Email Address</label>
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            id="email"
                                                            autoComplete="off"
                                                            placeholder="Email"
                                                            value={formData.email}
                                                            onFocus={() => setFormData({...formData, errorMessage: ''})}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        />
                                                        <p className="mt-2" style={{color:'#eb4034'}}>{formData.errorMessage}</p>
                                                    </div>
                                                    <center><Button
                                                        icon="fa fa-envelope"
                                                        title="Send Reset Link"
                                                        mode="icon-and-text"
                                                        wait={formData.wait}
                                                        onClick={() => handleForgotPassword()}
                                                    />
                                                    </center>
                                                    <div className="d-flex justify-content-between">
                                                        <label id="register" className="mt-3" onClick={() => { setForgotPanelOpen(false); setFormData({ email: '', password: '', passwordc: '' }) }}>
                                                            <i className="fa fa-arrow-left fa-md mr-2" aria-hidden="true"></i>
                                                            Go Back
                                                        </label>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    registerPanelOpen ? (
                                        <div className="container">
                                            <div className="row mt-1">
                                                <div className="col-12">
                                                    <form id="login-form">
                                                        <div className="form-group">
                                                            <label htmlFor="email">Email Address</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="email"
                                                                onFocus={() => setFormData({...formData, errorMessage: ''})}
                                                                placeholder="Email"
                                                                autoComplete="off"
                                                                value={formData.email}
                                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="password">Password</label>
                                                            <input
                                                                type="password"
                                                                className="form-control"
                                                                id="password"
                                                                autoComplete="off"
                                                                onFocus={() => setFormData({...formData, errorMessage: ''})}
                                                                placeholder="Password"
                                                                value={formData.password}
                                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="passwordc">Confirm Password </label>
                                                            <input
                                                                type="password"
                                                                className="form-control"
                                                                id="passwordc"
                                                                autoComplete="off"
                                                                onFocus={() => setFormData({...formData, errorMessage: ''})}
                                                                placeholder="Confirm Password"
                                                                value={formData.passwordc}
                                                                onChange={(e) => setFormData({ ...formData, passwordc: e.target.value })}
                                                            />
                                                            <p className="mt-2" style={{color:'#eb4034'}}>{formData.errorMessage}</p>
                                                        </div>
                                                        <center><Button
                                                            icon="fa fa-user"
                                                            title="Register"
                                                            mode="icon-and-text"
                                                            wait={formData.wait}
                                                            onClick={() => handleRegister()}
                                                        />
                                                        </center>
                                                        <div className="d-flex justify-content-between">
                                                            <label id="register" className="mt-3" onClick={() => { setRegisterPanelOpen(false); setFormData({ email: '', password: '', passwordc: '' }); }}>
                                                                <i className="fa fa-arrow-left fa-md mr-2" aria-hidden="true"></i>
                                                                Go Back
                                                            </label>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="container">
                                            {
                                                props.activeLink !== 'elo-boost' ? (
                                                    <>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <StyledFirebaseAuth
                                                                    uiConfig={uiConfig}
                                                                    firebaseAuth={firebase.auth()}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row" id="or-text">
                                                            <div className="col-5"></div>
                                                            <div className="col-2"><center>OR</center></div>
                                                            <div className="col-5"></div>
                                                        </div>
                                                    </>
                                                ) : null
                                            }
                                            <div className="row">
                                                <div className="col-12">
                                                    <form id="login-form">
                                                        <div className="form-group">
                                                            <label htmlFor="email">Email Address</label>
                                                            <input
                                                                type="email"
                                                                className="form-control"
                                                                id="email"
                                                                autoComplete="off"
                                                                onFocus={() => setFormData({...formData, errorMessage: ''})}
                                                                placeholder="Email"
                                                                value={formData.email}
                                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="password">Password</label>
                                                            <input
                                                                type="password"
                                                                className="form-control"
                                                                id="password"
                                                                autoComplete="off"
                                                                onFocus={() => setFormData({...formData, errorMessage: ''})}
                                                                placeholder="Password"
                                                                value={formData.password}
                                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                            />
                                                            <p className="mt-2" style={{color:'#eb4034'}}>{formData.errorMessage}</p>
                                                        </div>
                                                        
                                                        <center><Button
                                                            icon="fa fa-user"
                                                            title="Login"
                                                            mode="icon-and-text"
                                                            wait={formData.wait}
                                                            onClick={() => handleLogin()}
                                                        />
                                                        </center>
                                                        <div className="d-flex justify-content-between">
                                                            <label id="register" className="mt-3" onClick={() => { setRegisterPanelOpen(true); setFormData({ email: '', password: '', passwordc: '', errorMessage: '' }); }}>Register</label>
                                                            <label id="forgot-password" className="mt-3" onClick={() => { setForgotPanelOpen(true); setFormData({ email: '', password: '', passwordc: '', errorMessage: '' }) }}>Forgot Password</label>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div id="navbar" style={{ backgroundColor: '#000' }}>
                <nav className="navbar navbar-expand-lg navbar-light" style={{ padding: '.7rem 1rem' }}>
                    <div className="container">
                        <div id="login-button" >
                            {
                                currentUser && currentUser.emailVerified ? (
                                    <NavLink to="/account" style={{ textDecoration: 'none' }} exact>
                                        <Button icon="fa fa-user" mode="icon"  />
                                    </NavLink>
                                ) : (
                                    <Button icon="fa fa-user" mode="icon" onClick={() => handleLoginModalOpen()} data-toggle="modal" data-target="#login-modal" />
                                )
                            }
                        </div>
                        
                        <NavLink to="/" style={{ textDecoration: 'none' }} exact id="logo">
                            <img src="images/logo.webp" alt="logo" />
                        </NavLink>
                        <img src="images/logo.webp" id="navbar-mobile-links" alt="logo" style={{ width: "50%" }} />
                        
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#menu" id="menu-button" onClick={() => setMobileMenu(!mobileMenu)}>
                            {
                                mobileMenu ? (
                                    <i className="fa fa-close fa-md" aria-hidden="true" style={{ paddingRight: '1px', marginLeft: '1px' }}></i>
                                ) : (
                                    <i className="fa fa-navicon fa-md" aria-hidden="true"></i>
                                )
                            }
                        </button>

                        <div className="collapse navbar-collapse" id="menu">
                            <ul className="navbar-nav ml-auto mr-3">
                                <li className="nav-item">
                                    <NavLink to="/" style={{ textDecoration: 'none' }} exact>
                                        <a className="nav-link" href="#" id="navbar-links">
                                            HOME PAGE <br />
                                            {
                                                props.activeLink === 'home-page' ? (
                                                    <img
                                                        alt="active"
                                                        src="images/active_flame_middle.webp"
                                                        style={{
                                                            height: '18px',
                                                            position: 'absolute',
                                                            bottom: '10px',
                                                            width: '90px'
                                                        }}
                                                    />
                                                ) : null
                                            }
                                        </a>
                                    </NavLink>
                                    <NavLink to="/" style={{ textDecoration: 'none' }} exact>
                                        <a className="nav-link" href="#" id="navbar-mobile-links" style={{ color: props.activeLink === 'home-page' ? '#eeeded' : '#eeededb3', marginTop: '10px' }}>
                                            HOME PAGE
                                        </a>
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/elo-boost" style={{ textDecoration: 'none' }} exact>
                                        <a className="nav-link" href="#" id="navbar-links">
                                            ELO BOOST <br />
                                            {
                                                props.activeLink === 'elo-boost' ? (
                                                    <img
                                                        alt="active"
                                                        src="images/active_flame_middle.webp"
                                                        style={{
                                                            height: '18px',
                                                            position: 'absolute',
                                                            bottom: '10px',
                                                            width: '85px'
                                                        }}
                                                    />
                                                ) : null
                                            }
                                        </a>
                                    </NavLink>
                                    <NavLink to="/elo-boost" style={{ textDecoration: 'none' }} exact>
                                        <a className="nav-link" href="#" id="navbar-mobile-links" style={{ color: props.activeLink === 'elo-boost' ? '#eeeded' : '#eeededb3' }}>
                                            ELO BOOST
                                        </a>
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/booster-application" style={{ textDecoration: 'none' }} exact>
                                        <a className="nav-link" href="#" id="navbar-links">
                                            BOOSTER APPLICATION <br />
                                            {
                                                props.activeLink === 'booster-application' ? (
                                                    <img
                                                        alt="active"
                                                        src="images/active_flame_long.webp"
                                                        style={{
                                                            height: '18px',
                                                            position: 'absolute',
                                                            bottom: '10px',
                                                            width: '173px'
                                                        }}
                                                    />
                                                ) : null
                                            }
                                        </a>
                                    </NavLink>
                                    <NavLink to="/booster-application" style={{ textDecoration: 'none' }} exact>
                                        <a className="nav-link" href="#" id="navbar-mobile-links" style={{ color: props.activeLink === 'booster-application' ? '#eeeded' : '#eeededb3' }}>
                                            BOOSTER APPLICATION
                                        </a>
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/about-us" style={{ textDecoration: 'none' }} exact>
                                        <a className="nav-link" href="#" id="navbar-links">
                                            ABOUT US <br />
                                            {
                                                props.activeLink === 'about-us' ? (
                                                    <img
                                                        alt="active"
                                                        src="images/active_flame_middle.webp"
                                                        style={{
                                                            height: '18px',
                                                            position: 'absolute',
                                                            bottom: '10px',
                                                            width: '77px'
                                                        }}
                                                    />
                                                ) : null
                                            }
                                        </a>
                                    </NavLink>
                                    <NavLink to="/about-us" style={{ textDecoration: 'none' }} exact>
                                        <a className="nav-link" href="#" id="navbar-mobile-links" style={{ color: props.activeLink === 'about-us' ? '#eeeded' : '#eeededb3' }}>
                                            ABOUT US
                                        </a>
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/faq" style={{ textDecoration: 'none' }} exact>
                                        <a className="nav-link" href="#" id="navbar-links">
                                            F.A.Q <br />
                                            {
                                                props.activeLink === 'faq' ? (
                                                    <img
                                                        alt="active"
                                                        src="images/active_flame_short.webp"
                                                        style={{
                                                            height: '17px',
                                                            position: 'absolute',
                                                            bottom: '10px',
                                                            width: '41px'
                                                        }}
                                                    />
                                                ) : null
                                            }
                                        </a>
                                    </NavLink>
                                    <NavLink to="/faq" style={{ textDecoration: 'none' }} exact>
                                        <a className="nav-link" href="#" id="navbar-mobile-links" style={{ color: props.activeLink === 'faq' ? '#eeeded' : '#eeededb3' }}>
                                            F.A.Q
                                        </a>
                                    </NavLink>
                                </li>
                            </ul>
                            <div id="navbar-links">
                                {
                                    currentUser && currentUser.emailVerified ? (
                                        <NavLink to="/account" style={{ textDecoration: 'none' }} exact>
                                            <Button title="Account" mode="icon-and-text" />
                                        </NavLink>

                                    ) : (
                                        <Button icon="fa fa-user" title="Login" mode="icon-and-text" onClick={() => handleLoginModalOpen()} data-toggle="modal" data-target="#login-modal" />
                                    )
                                }
                            </div>

                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
}
export default withRouter(Navbar)