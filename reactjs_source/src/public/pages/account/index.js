import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../components/navbar';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Button from '../../components/button';
import app from '../../../core/base';
import firebase, { auth } from 'firebase';
import { AuthContext } from '../../../core/auth';
import 'react-phone-number-input/style.css'
import PhoneInput, { isPossiblePhoneNumber, formatPhoneNumber, formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input'
import { NavLink } from "react-router-dom";
import { API_URL } from '../../../core/constants';
import axios from 'axios';
import './style.css';

export default function Account() {
    var db = app.database().ref();
    const [currentTab, setCurrentTab] = useState('boosting');
    const [profile, setProfile] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        provider: '',
        errorMessage: '',
        success: false,
        wait: false
    });
    const { currentUser } = useContext(AuthContext);
    const [availableServices, setAvailableServices] = useState([]);
    const [orderhistory, setOrderHistory] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [allMessages, setAllMessages] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState({orderNo: '', _wait: true});

    useEffect(() => {
        var number = returnJson(currentUser.photoURL);
        if (currentUser.displayName) {
            var displayName = currentUser.displayName.split(' ');
            var _surname = displayName[displayName.length - 1].turkishtoEnglish();
            var _name = displayName.reverse().slice(1).reverse().toString().replace(',', ' ').turkishtoEnglish();
            setProfile({
                ...profile,
                name: _name,
                surname: _surname,
                email: currentUser.providerData[0].email,
                phone: number,
                provider: currentUser.providerData[0].providerId
            })
        }
        else {
            setProfile({
                ...profile,
                email: currentUser.providerData[0].email,
                phone: number,
                provider: currentUser.providerData[0].providerId
            })
        }
    }, [])

    const returnCred = (pass) => {
        return firebase.auth.EmailAuthProvider.credential(currentUser.email, pass);
    }
    const returnJson = (a) => {
        try {
            let jsk = JSON.parse(a).phoneNumber;
            return jsk
        }
        catch (error) {
            return '';
        }
    }
    String.prototype.turkishtoEnglish = function () {
        return this.replace('Ğ', 'g')
            .replace('Ü', 'u')
            .replace('Ş', 's')
            .replace('I', 'i')
            .replace('İ', 'i')
            .replace('Ö', 'o')
            .replace('Ç', 'c')
            .replace('ğ', 'g')
            .replace('ü', 'u')
            .replace('ş', 's')
            .replace('ı', 'i')
            .replace('ö', 'o')
            .replace('ç', 'c');
    };

    //#region handles 
    const handleSave = () => {
        if (profile.name || profile.surname) {
            if (!(profile.name && profile.surname)) {
                setProfile({ ...profile, errorMessage: '* Please type name and surname.' })
                return false;
            }
            else {
                setProfile({ ...profile, wait: true })
                currentUser.updateProfile({
                    displayName: profile.name + ' ' + profile.surname,
                }).then(() => {
                    if (profile.phone) {
                        if (!(isPossiblePhoneNumber(profile.phone) && isValidPhoneNumber(profile.phone) && formatPhoneNumber(profile.phone) && formatPhoneNumberIntl(profile.phone))) {
                            setProfile({ ...profile, errorMessage: '* Please enter the phone number in the correct format' })
                            return false;
                        }
                    }

                    currentUser.updateProfile({
                        photoURL: JSON.stringify({ phoneNumber: profile.phone })
                    }).then(() => {
                        console.log(profile.phone)
                        if (profile.currentPassword || profile.newPassword) {
                            if (!(profile.currentPassword && profile.newPassword)) {
                                setProfile({ ...profile, errorMessage: '* Please type current password and new password.' })
                                return false;
                            }
                            else if (profile.newPassword.length < 6) {
                                setProfile({ ...profile, errorMessage: '* Password should be at least 6 characters.' })
                                return false;
                            }
                            else {
                                var cred = returnCred(profile.currentPassword);
                                currentUser.reauthenticateWithCredential(cred).then(() => {
                                    currentUser.updatePassword(profile.newPassword).then(() => {
                                        currentUser.updateProfile({
                                            photoURL: JSON.stringify({ phoneNumber: profile.phone, photoURL: '' })
                                        }).then(() => {
                                            setProfile({ ...profile, wait: false, success: true });
                                        }).catch((error) => {
                                            setProfile({ ...profile, errorMessage: '* Unknown error.' })
                                        })
                                    })
                                }).catch((error) => {
                                    setProfile({ ...profile, errorMessage: '* Current password is incorrect.' })
                                    return false;
                                })
                            }
                        }
                        else {
                            setProfile({ ...profile, wait: false, success: true });
                        }

                    }).catch((error) => {
                        setProfile({ ...profile, wait: false, errorMessage: error.message })
                    })

                }).catch((error) => {
                    setProfile({ ...profile, wait: false, errorMessage: error.message })
                })
            }
        }
        else {
            if (currentUser.displayName) {
                setProfile({ ...profile, errorMessage: '* Please type name and surname.' })
            }
        }
    }
    //#endregion
    
    const handleMessageSend = () => {
        if(newMessage){
            db.child(`users/${currentUser.uid}`).once('value', data => {
                if(data.exists()){
                    let oldMessages = data.val().chat;
                    db.child(`users/${currentUser.uid}`).update({
                        chat: [
                            ...oldMessages,
                            {
                                message: newMessage,
                                user: 'client'
                            }
                        ],
                        lastModified: Date(),
                        userData: {
                            displayName: currentUser.displayName,
                            email: currentUser.email,
                            photoURL: currentUser.photoURL,
                            providerId: currentUser.providerData[0].providerId
                        }
                    }).then(()  => {
                        axios.get(API_URL + '/customer/message/notify').then((resp) => {
            
                        }).catch((err) => {
                          console.log(err);
                        })
                        console.log(currentUser);
                    }).catch((error) => {
                        console.log(error);
                    })
                }
                else {
                    db.child(`users/${currentUser.uid}`).set({
                        chat: [
                            {
                                message: newMessage,
                                user: 'client'
                            }
                        ],
                        lastModified: Date(),
                        userData: {
                            displayName: currentUser.displayName,
                            email: currentUser.email,
                            photoURL: currentUser.photoURL,
                            providerId: currentUser.providerData[0].providerId
                        }
                    }).then(() => {
                        axios.get(API_URL + '/customer/message/notify').then((resp) => {
            
                        }).catch((err) => {
                          console.log(err);
                        })
                    }).catch((error) => {
                        console.log(error);
                    })
                }
            })
            setNewMessage('');
        }
    }

    useEffect(() => {
        db.child(`users/${currentUser.uid}`).on('value', data => {
            if(data.exists()){
                let oldMessages = data.val().chat
                setAllMessages([...oldMessages]);
            }
        })
    },[])
    
    useEffect(() => {
        axios.get(API_URL + '/customer/order/' + currentUser.uid).then((resp) => {
            if(resp.data.length > 0) {
                let tmpHistory = [];
                let tmpAvailable = [];
                resp.data.map((order) => {
                    if(order.discordSuccess == true) {
                        tmpHistory.push({
                            ...order
                        })
                    }
                    else {
                        tmpAvailable.push({
                            ...order
                        })
                    }
                })
                setOrderHistory([...tmpHistory]);
                setAvailableServices([...tmpAvailable]);
            }

        }).catch((err) => {
            console.log(err);
        })
    },[])

    const handleViewOrderAvailable = (orderId) => {
        availableServices.map((order, index) => {
            if(order.orderId === orderId){
                setSelectedOrder({...selectedOrder, orderData: order, _wait: false})
            }
        })
    }
    const handleViewOrderHistory = (orderId) => {
        orderhistory.map((order, index) => {
            if(order.orderId === orderId){
                setSelectedOrder({...selectedOrder, orderData: order, _wait: false})
            }
        })
    }
    return (
        <div style={{ backgroundColor: '#000' }}>
            <Navbar isAccountPage={true} />
            <Header page={currentTab} />
            <div className="container mt-5">
                <div class="modal fade" id="order-view-modal" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Order No: {selectedOrder.orderData ? selectedOrder.orderData.orderId: null}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                {
                                    selectedOrder._wait ? <center>Please wait...</center> : (
                                        <>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-12 col-lg-6">
                                                        {
                                                            selectedOrder.orderData.detail[0][0].comboNames.map((cn, index) => {
                                                                return (
                                                                    <>
                                                                        <div className="form-group">
                                                                            <label>{cn.name}</label>
                                                                            <input value={cn.option} className="form-control" disabled/>
                                                                        </div>
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className="col-12 col-lg-6">    
                                                        <div className="form-group">
                                                            <label>Name Surname</label>
                                                            <input className="form-control" disabled={true} value={selectedOrder.orderData.account[0].nickname} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Summoner Name</label>
                                                            <input className="form-control" disabled={true} value={selectedOrder.orderData.account[0].summonerName} />
                                                        </div>
                                                        
                                                            <div className="form-group">
                                                                <label>Account ID</label>
                                                                <input className="form-control" disabled={true} value={selectedOrder.orderData.account[0].accountId} />
                                                            </div>
                                                        
                                                        <div className="form-group">
                                                            <label>Mobile Phone</label>
                                                            <input className="form-control" disabled={true} value={selectedOrder.orderData.account[0].phone} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Order Note</label>
                                                            <textarea className="form-control" disabled={true}>{selectedOrder.orderData.detail[0].note}</textarea>
                                                        </div>
                                                        {
                                                            selectedOrder.orderData.detail[0][1].switchs.length ? (
                                                                <p style={{fontWeight: 'bold'}}>Extra options</p>
                                                            ) : null
                                                        }
                                                        {
                                                            selectedOrder.orderData.detail[0][1].switchs.map((sw) => {
                                                                return (
                                                                    <><label>{sw}</label><br/></>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" id="custom-tab-panel">
                    <div className={`col-6 col-lg-3 ${currentTab === 'boosting' ? 'active-tab' : 'normal-tab'}`} onClick={() => setCurrentTab('boosting')}>
                        <i className="fa fa-bolt mr-2" aria-hidden="true"></i>
                        <span>Boosting</span>
                    </div>
                    <div className={`col-6 col-lg-3 ${currentTab === 'orderhistory' ? 'active-tab' : 'normal-tab'}`} onClick={() => setCurrentTab('orderhistory')}>
                        <i className="fa fa-shopping-bag mr-2" aria-hidden="true"></i>
                        <span>Order History</span>
                    </div>
                    <div className={`col-6 col-lg-3 ${currentTab === 'myprofile' ? 'active-tab' : 'normal-tab'}`} onClick={() => setCurrentTab('myprofile')}>
                        <i className="fa fa-id-card mr-2" aria-hidden="true"></i>
                        <span>My Profile</span>
                    </div>
                    <div className={`col-6 col-lg-3 ${currentTab === 'chatpanel' ? 'active-tab' : 'normal-tab'}`} onClick={() => setCurrentTab('chatpanel')}>
                        <i className="fa fa-comments mr-2" aria-hidden="true"></i>
                        <span>Chat Panel</span>
                    </div>
                </div>
                <div className="row mt-4 mb-5">
                    <div className="col-12 col-md-4 mb-3" id="left-toolbox">
                        <span id="welcome-text">WELCOME <br /><span style={{ color: '#FFC732', textTransform: 'uppercase' }}>{profile.name} {profile.surname}</span></span><br />
                        <div id="toolbox-info-text">
                            <p id="info-title">{
                                currentTab === 'boosting' ? 'BOOSTING' : null
                            }{
                                    currentTab === 'orderhistory' ? 'ORDER HISTORY' : null
                                }{
                                    currentTab === 'myprofile' ? 'MY PROFILE' : null
                                }{
                                    currentTab === 'chatpanel' ? 'CHAT PANEL' : null
                                }</p>
                            <span id="info-content">{
                                currentTab === 'boosting' ? 'You can check your current order on this page' : null
                            }{
                                    currentTab === 'orderhistory' ? 'You can see your order history here' : null
                                }{
                                    currentTab === 'myprofile' ? 'You can edit your profile details here' : null
                                }{
                                    currentTab === 'chatpanel' ? 'You can chat with booster and track your order here' : null
                                }</span>
                        </div>
                        <div id="button-group" className="mt-5 mb-4">
                            {
                                currentTab !== 'chatpanel' ? (
                                    <button type="button" class="btn btn-primary btn-block btn-lg" onClick={() => setCurrentTab('chatpanel')}>
                                        <i className="fa fa-comments mr-2" aria-hidden="true"></i>
                                        Chat Panel
                                    </button>
                                ) : null
                            }
                            <NavLink to="/elo-boost" type="button" className="btn-block" style={{ textDecoration: 'none' }} exact>
                                <button type="button" class="btn btn-outline-warning btn-block btn-lg">
                                    <i className="fa fa-gamepad mr-2" aria-hidden="true"></i>
                                    Elo Boost
                                </button>
                            </NavLink>
                            <button type="button" class="btn btn-outline-danger btn-block btn-lg" onClick={() => app.auth().signOut()}>
                                <i className="fa fa-sign-out mr-2" aria-hidden="true"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                    <div className="col-12 col-md-8">
                        {
                            currentTab === 'chatpanel' ? (
                                <div className="container" id="chat-container" >
                                    <div className="row" id="chat-area-title">
                                        <div className="col-12">
                                            <span>Live Support</span>
                                        </div>
                                    </div>
                                    <div className="row" id="chat-area">
                                        <div className="col-12">
                                            <div className="container">
                                                {
                                                    allMessages.map((data) => {
                                                        return (
                                                            <div className="row">
                                                                <div className="col-12" style={{padding: 0}}>
                                                                    {
                                                                        data.user === "client" ? (
                                                                            <span id="right-bubble">
                                                                                {data.message}
                                                                            </span>
                                                                        ) : (
                                                                            <span id="left-bubble">
                                                                                {data.message}
                                                                            </span>
                                                                        )
                                                                    }
                                                                   
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" id="chat-toolbox">
                                        <div className="input-group">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Type a message..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' ? handleMessageSend() : {}}
                                            />
                                            <div className="input-group-append">
                                                <button className="btn btn-outline-secondary" type="button" onClick={() => handleMessageSend()}>Send</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        }
                        {
                            currentTab === 'myprofile' ? (
                                <form id="profile-edit-container">
                                    <div className="row">
                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="name">Name</label>
                                                <input
                                                    className="form-control"
                                                    id="name"
                                                    value={profile.name}
                                                    onFocus={() => setProfile({ ...profile, errorMessage: '', success: false })}
                                                    onChange={(e) => setProfile({ ...profile, name: e.target.value.turkishtoEnglish() })}
                                                    autoComplete="off"
                                                    placeholder="Name"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="surname">Surname</label>
                                                <input
                                                    className="form-control"
                                                    id="surname"
                                                    value={profile.surname}
                                                    onFocus={() => setProfile({ ...profile, errorMessage: '', success: false })}
                                                    onChange={(e) => setProfile({ ...profile, surname: e.target.value.turkishtoEnglish() })}
                                                    autoComplete="off"
                                                    placeholder="Surname"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <input
                                                    className="form-control"
                                                    id="email"
                                                    disabled={true}
                                                    value={profile.email}
                                                    onFocus={() => setProfile({ ...profile, errorMessage: '', success: false })}
                                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                    autoComplete="off"
                                                    placeholder="Email"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="phone">Phone</label>
                                                <PhoneInput
                                                    placeholder="Phone"
                                                    className="form-control"
                                                    value={profile.phone}
                                                    onFocus={() => setProfile({ ...profile, errorMessage: '', success: false })}
                                                    onChange={(e) => setProfile({ ...profile, phone: e })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        profile.provider === "password" ? (
                                            <div className="row">
                                                <div className="col-12 col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="currentPassword">Current Password</label>
                                                        <input
                                                            className="form-control"
                                                            id="currentPassword"
                                                            type="password"
                                                            value={profile.currentPassword}
                                                            onFocus={() => setProfile({ ...profile, errorMessage: '', success: false })}
                                                            onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
                                                            autoComplete="off"
                                                            placeholder="Current Password"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="newPassword">New Password</label>
                                                        <input
                                                            placeholder="New Password"
                                                            type="password"
                                                            className="form-control"
                                                            value={profile.newPassword}
                                                            onFocus={() => setProfile({ ...profile, errorMessage: '', success: false })}
                                                            onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null
                                    }
                                    {
                                        profile.errorMessage ? (
                                            <p className="mt-2" style={{ color: '#eb4034' }}>{profile.errorMessage}</p>
                                        ) : (
                                            profile.success ? (
                                                <p className="mt-2" style={{ color: '#5af542' }}>Changes saved.</p>
                                            ) : null

                                        )
                                    }
                                    <div id="save-button">
                                        <Button
                                            icon="fa fa-save"
                                            title="Save"
                                            mode="icon-and-text"
                                            wait={profile.wait}
                                            onClick={() => handleSave()}
                                        />
                                    </div>
                                </form>
                            ) : null
                        }
                        {
                            currentTab === 'boosting' ? (
                                availableServices.length > 0 ? (
                                    <div className="">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="table-wrapper-scroll-y my-custom-scrollbar">
                                                    <table className="table">
                                                        <thead className="thead-dark sticky-top" style={{zIndex: 1}}>
                                                            <tr style={{ whiteSpace: 'nowrap' }}>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Order No</th>
                                                                <th scope="col">Order Status</th>
                                                                <th scope="col">Amount Paid</th>
                                                                <th scope="col">Date</th>
                                                                <th scope="col">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                availableServices.map((order,index) => {
                                                                    console.log(order)
                                                                    return (
                                                                        <tr style={{ whiteSpace: 'nowrap', fontSize: 14 }}>
                                                                            <th scope="row" style={{ fontWeight: 'normal', color: '#eeeded' }}>{index + 1}</th>
                                                                            <th scope="row" style={{ fontWeight: 'normal',color: '#eeeded'  }}>{order.orderId}</th>
                                                                            <th scope="row" style={{ fontWeight: 'normal',color: '#eeeded'  }}>{order.discordSuccess ? 'Completed' : (order.orderCheck ? 'Continues' : '--')}</th>
                                                                            <th scope="row" style={{ fontWeight: 'normal',color: '#eeeded'}}>{order.totalPrice} €</th>
                                                                            <th scope="row" style={{ fontWeight: 'normal',color: '#eeeded'}}>{new Date(order.createdAt).toString().split("GMT")[0]}</th>
                                                                            <th scope="row">
                                                                                <button className="btn btn-sm btn-success" data-toggle="modal" data-target="#order-view-modal" onClick={() => handleViewOrderAvailable(order.orderId)}>View</button>
                                                                            </th>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>                                        
                                    </div>
                                ) : (
                                    <div>
                                        <center id="not-found-text">
                                            <p>Available Service Not Found !</p>
                                            <NavLink to="/elo-boost" type="button" style={{ textDecoration: 'none' }} exact>
                                                <button type="button" class="btn btn-outline-warning btn-block">
                                                    Buy Boost
                                                </button>
                                            </NavLink>
                                        </center>
                                    </div>
                                )
                            ) : null
                        }
                        {
                            currentTab === 'orderhistory' ? (
                                orderhistory.length > 0 ? (
                                    <div className="">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="table-wrapper-scroll-y my-custom-scrollbar">
                                                    <table className="table">
                                                        <thead className="thead-dark sticky-top" style={{zIndex: 1}}>
                                                            <tr style={{ whiteSpace: 'nowrap' }}>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Order No</th>
                                                                <th scope="col">Order Status</th>
                                                                <th scope="col">Amount Paid</th>
                                                                <th scope="col">Date</th>
                                                                <th scope="col">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                orderhistory.map((order,index) => {
                                                                    console.log(order)
                                                                    return (
                                                                        <tr style={{ whiteSpace: 'nowrap', fontSize: 14 }}>
                                                                            <th scope="row" style={{ fontWeight: 'normal', color: '#eeeded' }}>{index + 1}</th>
                                                                            <th scope="row" style={{ fontWeight: 'normal',color: '#eeeded'  }}>{order.orderId}</th>
                                                                            <th scope="row" style={{ fontWeight: 'normal',color: '#eeeded'  }}>{order.discordSuccess ? 'Completed' : (order.orderCheck ? 'Continues' : '--')}</th>
                                                                            <th scope="row" style={{ fontWeight: 'normal',color: '#eeeded'}}>{order.totalPrice} €</th>
                                                                            <th scope="row" style={{ fontWeight: 'normal',color: '#eeeded'}}>{new Date(order.createdAt).toString().split("GMT")[0]}</th>
                                                                            <th scope="row">
                                                                                <button className="btn btn-sm btn-success" data-toggle="modal" data-target="#order-view-modal" onClick={() => handleViewOrderHistory(order.orderId)}>View</button>
                                                                            </th>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>                                        
                                    </div>
                                ) : (
                                    <div>
                                        <center id="not-found-text">
                                            <p>Order History Not Found !</p>
                                            <NavLink to="/elo-boost" type="button" style={{ textDecoration: 'none' }} exact>
                                                <button type="button" class="btn btn-outline-warning btn-block">
                                                    Buy Boost
                                                </button>
                                            </NavLink>
                                        </center>
                                    </div>
                                )
                            ) : null
                        }
                        
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}