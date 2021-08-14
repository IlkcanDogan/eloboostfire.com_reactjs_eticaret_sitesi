import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './core/auth';
import PrivateRoute from './core/privateRoute';
import { Widget, addResponseMessage, toggleMsgLoader,setBadgeCount, addUserMessage } from 'react-chat-widget';
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';
import app from './core/base';
import Timestamp from 'react-timestamp';
import './App.css';

//#region Public Pages
import Home from './public/pages/home';
import EloBoost from './public/pages/eloboost';
import BoostApplication from './public/pages/boostapplication';
import AboutUs from './public/pages/aboutus';
import Faq from './public/pages/faq';
import Account from './public/pages/account';
import Privacy from './public/pages/privacy';
import Payment from './public/pages/payment';
//#endregion

//#region Admin Pages
import Login from './admin/pages/login';
import Dashboard from './admin/pages/dashboard';
//#endregion

import axios from 'axios';
import { API_URL } from './core/constants';

function App() {
  const newUid = uuidv4();
  const [cookies, setCookie] = useCookies(['browserId']);
  var db = app.database().ref();

  useEffect(() => {
    if(cookies.browserId !== undefined) {
      db.child(`anonchats/${cookies.browserId}`).once('value', data => {
          if(data.exists()){
            let allMessages = data.val().chat;
            allMessages.map((msg) => {
              if(msg.user === 'server'){
                addResponseMessage(msg.message);
              }
              else {
                addUserMessage(msg.message)
              }
            })
            setBadgeCount(1)
          }
          else {
            addResponseMessage('Welcome to eloboostfire!');
            setBadgeCount(1)
          }
      })
    }
    else{
      db.child(`anonchats/${newUid}`).set({
          chat: [
            {
              user: 'server',
              message: 'Welcome to eloboostfire!',
            },
          ]
      }).then(() => {
        addResponseMessage('Welcome to eloboostfire!');
        setCookie('browserId', newUid, { path: '/' });
      }).catch((error) => {
        console.log(error);
      })
    }
  },[])

  useEffect(() => {
      db.child(`anonchats/${cookies.browserId}`).on('child_changed', data => {
        try{
          if(data.exists()){
            let allMessages = data.val()
            
            if(allMessages[allMessages.length - 1].user === 'server'){
              addResponseMessage(allMessages[allMessages.length - 1].message);
              setBadgeCount(1)
            }
          }
        }catch(error){
          console.log(data.val())
        }
    })
  })
  
  const handleNewUserMessage = (newMessage) => {
    db.child(`anonchats/${cookies.browserId}`).once('value', data => {
      if(data.exists()){
        let messageHistory = data.val().chat;
        db.child(`anonchats/${cookies.browserId}`).update({
          chat: [
            ...messageHistory,
            {
              user: 'client',
              message: newMessage,
            }
          ],
          lastModified: Date()
        }).then(() => {
          axios.get(API_URL + '/customer/message/notify').then((resp) => {
            
          }).catch((err) => {
            console.log(err);
          })
        }).catch((error) => {
          console.log(error);
        })
      }
      else {
        //
      }
    })
  };

  return (
    <AuthProvider>
      <Router>
        <div>
          <Widget
            handleNewUserMessage={handleNewUserMessage}
            title="ELOBOOSTFIRE"
            showTimeStamp={false}
            showCloseButton={true}
            subtitle="Live Support"
          />
        </div>
        <Switch>
          <Route exact path='/' component={Home}></Route>
          <Route exact path='/elo-boost' component={EloBoost}></Route>
          <Route exact path='/league-boosting' component={EloBoost}></Route>
          <Route exact path='/duo-boosting' component={EloBoost}></Route>
          <Route exact path='/win-boosting' component={EloBoost}></Route>
          <Route exact path='/placement-boosting' component={EloBoost}></Route>
          <Route exact path='/normal-matches' component={EloBoost}></Route>
          <Route exact path='/coaching' component={EloBoost}></Route>
          <Route exact path='/booster-application' component={BoostApplication}></Route>
          <Route exact path='/about-us' component={AboutUs}></Route>
          <Route exact path='/faq' component={Faq}></Route>
          <Route exact path='/privacy' component={Privacy}></Route>
          <Route exact path='/payment/:orderToken' component={Payment}></Route>
          <Route exact path='/admin' component={Login}></Route>
          <PrivateRoute exact path='/account' component={Account}></PrivateRoute>
          <PrivateRoute exact path='/admin/dashboard' component={Dashboard}></PrivateRoute>
        </Switch>
      </Router>
    </AuthProvider>
  );
}


export default App;