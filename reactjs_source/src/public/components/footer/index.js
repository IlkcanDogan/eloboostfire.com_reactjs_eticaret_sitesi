import React, { useState, useEffect } from 'react';
import { ColorButton } from '../button';
import { NavLink } from "react-router-dom";
import { API_URL } from '../../../core/constants';
import axios from 'axios';
import './style.css';

export default function Footer() {

    const [orderNumber, setOrderNumber] = useState('');
    const [orderData, setOrderData] = useState([]);
    const [wait, setWait] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [social, setSocial] = useState({instagram: '', discord: ''});
    const handleTrack = () => {
        if(orderNumber !== '') {
            setWait(true);
            axios.get(API_URL + '/customer/order/get/' + orderNumber).then((resp) => {
                setWait(false);
                if(resp.data.length) {
                    setOrderData([
                        ...resp.data
                    ])
                }
                else {
                    setErrorMessage('* Order not found')
                }
            }).catch((err) => {
                setErrorMessage('* There is a problem')
                setWait(false);
            })
        }
        else {
            setErrorMessage('* Please do not leave blank')
        }
    }
    useEffect(() => {
        axios.get(API_URL + '/config').then((resp) => {
            setSocial({...resp.data.social})
        }).catch((err) => {
            console.log(err);
        })
    }, [])
    return (
        <>
            <div className="modal fade" id="order-track-modal" tabindex="-1" role="dialog" aria-labelledby="order-track-modal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content" style={{ border: 'none', backgroundColor: 'transparent' }}>
                        <div className="modal-body" id="order-track-container">
                            {
                                orderData.length ? (
                                    <div className="container">
                                        <div className="row" style={{color: 'white'}}>
                                            <div className="col-12">
                                                <center style={{fontWeight: 'bold', fontSize: 18, marginBottom: 20}}>ORDER TRACK</center>
                                            </div>
                                        </div>
                                        <div className="row" style={{color: 'gray'}}>
                                            <div className="col-12">
                                                <span style={{float: 'left'}}>Order No:</span>
                                                <span style={{float: 'right'}}>{orderNumber}</span>
                                            </div>
                                        </div>
                                        <div className="row" style={{color: 'gray'}}>
                                            <div className="col-12">
                                                <span style={{float: 'left'}}>Order Status:</span>
                                                <span style={{float: 'right'}}>
                                                    {orderData[0].orderCheck ? 'Approved':'Waiting'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="row" style={{color: 'gray'}}>
                                            <div className="col-12">
                                                <span style={{float: 'left'}}>Completion Status:</span>
                                                <span style={{float: 'right'}}>
                                                    {orderData[0].discordSuccess ? 'Completed':'Waiting'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="row" style={{color: 'gray'}}>
                                            <div className="col-12">
                                                <span style={{float: 'left'}}>Total Price:</span>
                                                <span style={{float: 'right'}}>
                                                    {orderData[0].totalPrice} €
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-12">
                                                <form id="order-track-form">
                                                    <div className="form-group">
                                                        <label htmlFor="email">Track an Order</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="order-number"
                                                            placeholder="Order Number"
                                                            value={orderNumber}
                                                            onChange={(e) => setOrderNumber(e.target.value)}
                                                            onFocus={() => setErrorMessage('')}
                                                        />
                                                    </div>
                                                    <p style={{fontWeight: 'bold', color: 'red'}}>
                                                        {errorMessage}
                                                    </p>
                                                    <center>
                                                        <ColorButton  title={wait ? 'Wait...' : 'Track'} onClick={() => !wait ? handleTrack() : null } />
                                                    </center>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <img src="images/under_flame.png" alt="" style={{ width: '100%' }} />
            <div className="container mt-5">
                <div className="row mt-4">
                    <div className="col-12 col-md-6 col-lg-3 mb-4">
                        <img src="images/logo.webp" alt="" />
                        <p id="footer-info-text" className="mt-2 mb-4">
                            Eloboostfire, At Your Service!
                        </p>
                        <p id="footer-info-text"><i className="fa fa-map-marker ml-1" aria-hidden="true" style={{ marginRight: 8 }}></i> Munich, Germany </p>
                        <p id="footer-info-text"><i className="fa fa-envelope" aria-hidden="true" style={{ marginRight: 6 }}></i> support@eloboostfire.com </p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6 mb-5">
                        <div className="row">
                            <div className="col-12">
                                <center>
                                    <p id="title">MENU</p>
                                    <NavLink to="/about-us" style={{ textDecoration: 'none' }} exact>
                                        <span id="footer-info-text">About Us</span><br />
                                    </NavLink>
                                    <NavLink to="/faq" style={{ textDecoration: 'none' }} exact>
                                        <span id="footer-info-text">F.A.Q</span><br />
                                    </NavLink>
                                    <NavLink to="/privacy" style={{ textDecoration: 'none' }} exact>
                                        <span id="footer-info-text">Privacy & Terms</span><br />
                                    </NavLink>
                                </center>
                            </div>
                            {/*<div className="col-6">
                                <center>
                                    <p id="title">MENU 2</p>
                                    <a id="footer-info-text" href="#">[Link1]</a><br />
                                    <a id="footer-info-text" href="#">[Link2]</a><br />
                                    <a id="footer-info-text" href="#">[Link3]</a><br />
                                </center>
                            </div>*/}
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-3">
                        <div id="order-button">
                            <ColorButton title="Order Track" onClick={() => {setOrderNumber(''); setOrderData([]); setErrorMessage(''); setWait(false)}} data-toggle="modal" data-target="#order-track-modal" />
                            <div className="container mt-4">
                                <div className="row">
                                    <div className="col-6 d-flex justify-content-center text-center">
                                        <div style={{height: 30, width: 30}}>
                                            <a href={`https://instagram.com/${social.instagram}`} target="_blank">
                                                <img src="images/social/instagram_icon.svg" alt="instagram icon" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-6 d-flex justify-content-center text-center">
                                        <div style={{height: 30, width: 30, marginTop: -3}}>
                                            <a href={`${social.discord}`} target="_blank">
                                                <img src="images/social/discord_icon.svg" alt="discord icon" width="37"/>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="payment-logo">
                            <img src="images/paypal_and_wise_logo.webp" alt="" className="img-fluid mt-4" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mb-3 mt-3">
                        <center>
                            <span id="footer-info-text">Copyright © 2021 </span>
                            <span style={{ color: '#FFC732' }}>eloboostfire </span>
                            <span id="footer-info-text">All Rights Reserved</span>
                        </center>
                    </div>
                </div>
            </div>
        </>
    )
}
