import React from 'react'
import { ColorButton } from '../button';
import { NavLink } from "react-router-dom";
import './style.css';

export default function index(props) {
    const title = props.title, content = props.content, content2 = props.content2, content3= props.content3, poster = props.poster;

    return (
        <>
            {
                props.text === 'left' ? (
                    <>
                        <div className="container">
                            <div className="row">
                                <div className="col-12 mb-5">
                                    <div className="row">
                                        <div className="col-12 col-md-12 col-lg-4 pt-5" >
                                            <p id="title" className="mb-5" style={{ textDecoration: 'underline', textDecorationColor: 'gray', textUnderlineOffset: 3 }}>{title}</p>
                                            <p id="info-text">{content}</p> <br />
                                            <p id="info-text">{content2}</p>
                                            <span style={{ float: 'left' }}>
                                                {
                                                    props.button !== 'none' ? (
                                                        <NavLink to="/about-us" style={{ textDecoration: 'none' }} exact>
                                                            <ColorButton title="ABOUT US" onClick={() => console.log('ColorButton Click')} />
                                                        </NavLink>
                                                       
                                                    ) : null
                                                }
                                            </span>
                                        </div>
                                        <div className="col-12 col-md-12 col-lg-8 pt-5" >
                                            <div style={{ float: 'right' }}>
                                                <img src={`${poster}`} alt="poster" className="img-fluid" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="container">
                            <div className="row">
                                <div className="col-12 mb-5">
                                    
                                    <div className="row" id="desktop-row">
                                        <div className="col-12 col-md-12 col-lg-8 pt-5" >
                                            <div style={{ float: 'left' }}>
                                                <img src={`${poster}`} alt="poster" className="img-fluid" />
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-4 pt-5" >
                                            <p id="title" className="mb-5" style={{ textDecoration: 'underline', textDecorationColor: 'gray', textUnderlineOffset: 3 }}>{title}</p>
                                            <p id="info-text">{content}</p> <br />
                                            <p id="info-text">{content2}</p>
                                        </div>
                                    </div>

                                    <div className="row" id="mobile-row">
                                        <div className="col-12 col-md-12 col-lg-4 pt-5" >
                                            <p id="title" className="mb-5" style={{ textDecoration: 'underline', textDecorationColor: 'gray', textUnderlineOffset: 3 }}>{title}</p>
                                            <p id="info-text">{content}</p> <br />
                                            <p id="info-text">{content2}</p>
                                        </div>
                                        <div className="col-12 col-md-12 col-lg-8 pt-5" >
                                            <div style={{ float: 'left' }}>
                                                <img src={`${poster}`} alt="poster" className="img-fluid" />
                                            </div>
                                        </div>

                                        
                                    </div>

                                </div>
                            </div>
                        </div>
                        
                    </>
                )
            }
        </>
    )
}
