import React from 'react';
import { NavLink } from "react-router-dom";
import './style.css';
import { ColorButton } from '../button';

export default function index(props) {
    return (
        <>
            {
                props.page === "main" ? (
                    <div id="header-container">
                        <div className="container">
                            <div className="row">
                                <div className="col-1 col-lg-4"></div>
                                <div className="col-10 col-lg-4" id="white-area">
                                    <img src="images/lol_logo.png" alt="lol_logo" className="img-fluid" style={{ height: '42%' }} />
                                    <p id="title">ELO BOOST SERVICE</p>
                                    <p id="info-text">
                                        We offer the best boost services with our booster 
                                        team under the guarantee of trust, quality, speed and the best price.
                                    </p>
                                    <NavLink to="/elo-boost" style={{ textDecoration: 'none' }} exact>
                                        <ColorButton title="GO" onClick={() => console.log('ColorButton Click')} />
                                    </NavLink>
                                    
                                </div>
                                <div className="col-1 col-lg-4"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div id="small-header-container">
                        <div className="container">
                            <div className="row">
                                <div className="col-1 col-lg-4"></div>
                                <div className="col-10 col-lg-4" id="small-white-area"> 
                                    <p id="big-title" style={{fontSize: props.page === 'boosterapplication' ? 20 : null}}>{
                                        props.page === 'aboutus' ? 'ABOUT US' : null
                                    }{
                                        props.page === 'faq' ? 'F.A.Q' : null
                                    }{
                                        props.page === 'boosterapplication' ? 'BOOSTER APPLICATION' : null
                                    }{
                                        props.page === 'eloboost' ? 'ELO BOOST' : null
                                    }{
                                        props.page === 'boosting' ? 'BOOOSTING' : null 
                                    }{
                                        props.page === 'orderhistory' ? 'ORDER HISTORY' : null
                                    }{
                                        props.page === 'myprofile' ? 'MY PROFILE' : null
                                    }{
                                        props.page === 'chatpanel' ? 'CHAT PANEL' : null
                                    }{
                                        props.page === 'privacy' ? 'PRIVACY & TERMS' : null
                                    }</p>
                                    <span id="page-link">
                                        <NavLink to="/" style={{ textDecoration: 'none' }} exact>
                                            <a href="#" style={{ color: 'rgb(221, 220, 220)' }}>HOME PAGE</a>
                                        </NavLink>
                                    <span> &#187; </span>
                                        <span style={{ color: '#FFC732' }}>
                                            {
                                                props.page === 'aboutus' ? 'ABOUT US' : null
                                            }
                                            {
                                                props.page === 'faq' ? 'F.A.Q' : null
                                            }
                                            {
                                                props.page === 'boosterapplication' ? 'BOOSTER APPLICATION' : null
                                            }
                                            {
                                                props.page === 'eloboost' ? 'ELO BOOST' : null
                                            }
                                            {
                                                props.page === 'boosting' ? 'BOOSTING' : null
                                            }
                                            {
                                                props.page === 'orderhistory' ? 'ORDER HISTORY' : null 
                                            }
                                            {
                                                props.page === 'myprofile' ? 'MY PROFILE' : null
                                            }
                                            {
                                                props.page === 'chatpanel' ? 'CHAT PANEL' : null
                                            }
                                            {
                                                props.page === 'privacy' ? 'PRIVACY & TERMS' : null
                                            }
                                        </span>
                                    </span>
                                </div>
                                <div className="col-1 col-lg-4"></div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
