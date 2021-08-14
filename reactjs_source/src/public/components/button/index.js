import React from 'react'
import './style.css';

export default function index(props) {
    return (
        <>
            {
                props.wait ? (
                    <div id="wait-button">
                        Please wait... 
                        <span className="spinner-border spinner-border-sm ml-3" role="status" aria-hidden="true"></span>
                    </div>
                ) : (
                    <div id="button" onClick={props.onClick} {...props}>
                        {
                            props.icon ? (
                                <i className={`${props.icon} ${props.mode === 'icon' ? '' : 'mr-1'}`} aria-hidden="true"></i>
                            ) : null
                        }
                        {props.title} 
                    </div>
                )
            }
        </>
    )
}

export function ColorButton(props) {
    return (
        <div id="color-button" onClick={props.onClick} {...props}>
            {props.title}
        </div>
    )
}
//