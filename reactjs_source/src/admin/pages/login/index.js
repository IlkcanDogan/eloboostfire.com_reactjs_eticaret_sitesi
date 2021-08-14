import React,{useEffect, useState,useCallback, useContext} from 'react';
import './style.css';
import $ from 'jquery';
import { withRouter, Redirect } from 'react-router'
import app from '../../../core/base';
import { AuthContext } from '../../../core/auth';

function Login(props, { history }) {
    const { currentUser } = useContext(AuthContext);
    
    useEffect(() => {
        $('.rcw-widget-container').hide();
    },[])

    const [form, setForm] = useState({email: '', password: '', _error: '', _wait: false})
    
    const handleLogin = useCallback(
        async event => {
            if(form.email && form.password) {
                setForm({...form, _wait: true})
                try {
                    await app.auth().signInWithEmailAndPassword(form.email, form.password).then((user) => {

                    })
                }
                catch (error) {
                    setForm({ ...form, _error: '* Eposta veya şifre hatalı.', _wait: false})
                }
            }
            else {
                setForm({...form, _error: '* Lütfen eposta ve şifrenizi yazın.'})
            }
        }
    )
    if(currentUser){
        if(currentUser.uid === 'xbKvxxvKpLbckmx7dj3EloDL5W93'){
            return <Redirect to='/admin/dashboard' />
        }
        else {
            return <Redirect to='/' />
        }
    }

    return (
        <div className="ctn">
            <div className="form-signin mt-5">
                <div className="d-flex justify-content-center text-center">
                    <img className="mb-5 img-fluid" src="/images/logo.webp" alt="" />
                    
                </div>
                <p style={{ fontWeight: 'bold', fontSize: 20}}>Admin Giriş</p>
                <input 
                    type="text" 
                    id="inputEmail" 
                    className="form-control" 
                    placeholder="Eposta Adresi"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    onFocus={() => setForm({...form, _error: ''})}
                />
                <input 
                    type="password" 
                    id="inputPassword" 
                    className="form-control mt-3" 
                    placeholder="Şifre"
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    onFocus={() => setForm({...form, _error: ''})}
                />
                <p style={{color: 'red', fontWeight: 'bold', fontSize: 15}}>{form._error}</p>
                <button className="btn btn-lg btn-dark btn-block" disabled={form._wait} onClick={() => handleLogin()}>Giriş Yap</button>
            </div>
        </div>
    )
}

export default withRouter(Login);