import React, { useContext } from 'react'
import Navbar from '../../components/navbar';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { AuthContext } from '../../../core/auth';
import './style.css';

export default function Index() {
    const { currentUser } = useContext(AuthContext);

    return (
        <div style={{ backgroundColor: '#000' }}>
            <Navbar mode={currentUser ? "private" : ""} />
            <Header page="privacy" />
            <div className="container">
                <div className="row">
                    <div className="col-12 mt-5 mb-5">
                        <h3 style={{ color: 'white' }}>PRIVACY AND SECURITY POLICY</h3>
                        <p style={{ color: 'gray' }}>All services provided in our store belong to Anıl Berk, registered at Istanbul address, and are operated by Eloboostfire.</p>
                        <p style={{ color: 'gray' }}>Eloboostfire may collect personal data for various purposes. How and in what way the collected personal data is collected, how and how this data is protected is stated below.
                        <br /><br />
                        Due to the nature of the business, our Store collects some personal information about the members (such as name-surname, company information, telephone, address or e-mail addresses) by filling out various forms and surveys on the Membership or our Store.
                        <br /><br />
                        Eloboostfire may send campaign information, information about new products, promotional offers to its customers and members in some periods. Our members can make all kinds of choices about whether or not to receive such information while becoming a member, then this selection can be changed in the account information section after logging in as a member, or they can make a notification with the link in the information message received.
                        </p>
                        <br/><br/>
                        <h3 style={{ color: 'white' }}>BROWSER COOKIES</h3>
                        <p style={{ color: 'gray' }}>Eloboostfire can obtain information about the users visiting our store and the use of the website by using a technical communication file (Cookie). The technical communication files mentioned are small text files that a website sends to the user's browser to be stored in the main memory. The technical communication file stores status and preferences about the site, making it easier to use the Internet.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
