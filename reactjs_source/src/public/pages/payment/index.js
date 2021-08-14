import React from 'react';
import { useParams } from 'react-router-dom'
import './style.css';

export default function Payment(){
    const { orderToken } = useParams();
    return (
        <>
            {
                orderToken !== '' && orderToken !== 'success'  && orderToken !== 'faild' ? (
                    <>
                    <script src="https://www.paytr.com/js/iframeResizer.min.js"></script>
                    <iframe src={"https://www.paytr.com/odeme/guvenli/" + orderToken} id="paytriframe" frameborder="0" scrolling="yes" style={{width: '100%'}}></iframe>
                    <script>iFrameResize({},'#paytriframe');</script>
                    </>
                ): null
            }
            {
                orderToken !== '' && orderToken === 'success'  && orderToken !== 'faild' ? (
                    <div className="container mt-5">
                        <center>
                            <i class="fa fa-check-circle" style={{color: 'green', fontSize: 100}} aria-hidden="true"></i>
                            <h3 className="mb-5">Payment Successful!</h3>
                            <a href="https://eloboostfire.com/">Go to home</a>
                        </center>
                    </div>
                ) : null
            }
            {
                orderToken !== '' && orderToken !== 'success'  && orderToken === 'faild' ? (
                    <div className="container mt-5">
                        <center>
                            <i class="fa fa-times-circle" style={{color: 'red', fontSize: 100}} aria-hidden="true"></i>
                            <h3 className="mb-5">Payment Faild!</h3>
                            <a href="https://eloboostfire.com">Go to home</a>
                        </center>
                    </div>
                ) : null
            }
        </>
    )
}