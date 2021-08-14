import React,{useContext} from 'react'
import Navbar from '../../components/navbar';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { AuthContext } from '../../../core/auth';
import {
    Accordion,
    AccordionItem,
    AccordionItemButton,
    AccordionItemHeading,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import './style.css';

export default function Index() {
    const { currentUser } = useContext(AuthContext);
    const faq = [
        {
            title: 'Why should I choose you',
            content: 'In addition to many eloboost service providers, Eloboostfire offers the highest commission to boosters, as well as the most affordable price to the customer. Since it is a business established by Computer and Software Engineers, the cost is minimized, R&D studies are carried out by these people, therefore we do not have to purchase services from outside (we do not have site-chatbot-panel-design-development costs) and therefore the most affordable price. Do not hesitate to choose us as we provide quality service.'
        },
        {
            title: 'Are commissions charged at checkout',
            content: 'No, we do not charge any commission on your payment.'
        },
        {
            title: 'Will my payment be confirmed immediately',
            content: 'Yes, as soon as you make the payment, your payment is confirmed and the service process begins.'
        },
        /*{
            title: 'What payment methods are available',
            content: 'Eloboostfire works with "PAYTR" secure pos services for the security of your payments, and the information you provide is processed only in your own browser, and its security is ensured without being transmitted to us.'
        },*/
        {
            title: 'May I speak with the manager',
            content: 'Of course, you can talk to our managers on Discord 24/7 and get instant feedback. We remind you that our goal is customer satisfaction, and we hope that you can directly ask any question that comes to your mind.'
        },
        {
            title: 'Are you returning',
            content: 'Of course, if you immediately notify us of a transaction that has not yet entered the service process, you will receive a refund. However, please note that as the balance is transferred to the booster accounts as soon as the service starts, it is not possible to return your transactions that have entered this process.'
        },
        {
            title: 'Do you guarantee 100% account security',
            content: 'Yes, we do. During the eloboost services to be performed by us, we first start the necessary scanning processes on the computers of all boosters registered with Eloboostfire in order to ensure the security of your account. After the scan, the Eloboostfire administrator team encrypts all the information you have entered for the security of your accounts and keeps them on servers that cannot be accessed from outside. In terms of game internal dynamics, we take the necessary precautions and measures against all situations that will endanger your account security. Since our goal is customer satisfaction, we examine all the problems that may occur even unintentionally by our boosters and compensate 100%.'
        },
        {
            title: 'Are you using third party apps',
            content: 'No way! All of our boosters are Professionals and most of them are already in teams as E-Sports players. As per our Account Security policy, we make sure that all our boosters do not use third-party software by regularly checking their computers, so rest your mind.'
        },
        {
            title: 'How can I order',
            content: 'We do not need any membership or detailed personal information in order to place an order, you can purchase the service with a few information requested from you while receiving Eloboost service.'
        },
        {
            title: 'How can I find out the status of my order',
            content: 'We will be waiting on our Discord server to respond to you and to follow your services. As soon as you write to us, you will be able to learn what stage it is in, what condition it is in and even the tips you may need.'
        },
        {
            title: 'Is there a risk of ban as a result of Elo Boost',
            content: 'There is no ban risk as a result of the direct eloboost process. Indirectly, the risk of ban is 1/1,000,000 -almost none- according to Riot Games statistics.'
        },
        {
            title: 'Can I log into my account while the order is in progress',
            content: 'Unlike other businesses that provide boosting services, since we are in constant contact with you, you can log in to your account when you confirm that you are not in the account from the booster and that the account will not provide boosting service.'
        },

    ]
    return (
        <div style={{ backgroundColor: '#000' }}>
            <Navbar activeLink="faq"  mode={currentUser ? "private" : ""}/>
            <Header page="faq" />
            <div className="container">
                <div className="row">
                    <div className="col-12 mt-5 mb-5">
                        <Accordion>
                            {
                                faq.map((item, index) => {
                                    return (
                                        <AccordionItem id={index}>
                                            <AccordionItemHeading>
                                                <AccordionItemButton>
                                                    {item.title}
                                                </AccordionItemButton>
                                            </AccordionItemHeading>
                                            <AccordionItemPanel>
                                                <p>
                                                   {item.content}
                                                </p>
                                            </AccordionItemPanel>
                                        </AccordionItem>
                                    )
                                })
                            }
                        </Accordion>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
