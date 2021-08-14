import React,{useContext} from 'react'
import Navbar from '../../components/navbar';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { ColorButton } from '../../components/button';
import { AuthContext } from '../../../core/auth';
import './style.css';

export default function Index() {
    const { currentUser } = useContext(AuthContext);
    return (
        <div style={{backgroundColor: '#000'}}>
            <Navbar activeLink="booster-application"  mode={currentUser ? "private" : ""} />
            <Header page="boosterapplication" />
            <div className="container">
                <div className="row mt-5 mb-5">
                    <div className="col-12">
                        <center>
                            <h2 id="application-title"><span style={{color: 'rgb(221, 220, 220)', textShadow: 'none'}}>LOL BOOSTER </span>APPLICATION</h2>
                            <p id="application-content" className="mt-5 mb-4">    
                                LOL Booster Applications reach us after filling out the 
                                information in the form by clicking <a href="#" style={{color: '#FFC732',cursor: 'pointer'}}>here</a>. 
                                Hoping to work together.
                            </p>
                            <ColorButton title="GO TO FORM" onClick={() => window.document.location.href="https://docs.google.com/forms/d/e/1FAIpQLSfpuI5VwkMslGvMtzyJmPoD4W4a9NvCiqpCKNUfwT-vSpE2_Q/viewform"} />
                        </center>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
