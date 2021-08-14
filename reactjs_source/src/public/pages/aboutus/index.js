import React,{useContext} from 'react'
import Navbar from '../../components/navbar';
import Header from '../../components/header';
import Section from '../../components/section';
import Footer from '../../components/footer'
import { AuthContext } from '../../../core/auth';
import './style.css';

export default function AboutUs() {
    const { currentUser } = useContext(AuthContext);
    return (
        <div style={{backgroundColor: '#000'}}>
            <Navbar activeLink="about-us" mode={currentUser ? "private" : ""} />
            <Header page="aboutus" />
            
            <Section text="left" title="About Us" 
                content="Established by two Computer and Software Engineers, 
                Eloboostfire was established with the aim of providing quality service with its booster 
                team consisting entirely of professionals, aiming to provide fast, safe and high quality 
                Eloboost services to its customers, by kneading information with League Of Legends experience." 
                content2="In its vision, Eloboostfire has an approach that focuses on providing services in different countries, and in its mission, it works with low commission rates that only target Eloboostfire basic expenses with the logic of 
                more profit for boosters, less cost to the customer and focused on 
                customer satisfaction. It guarantees an affordable price."
                poster="images/poster_3.webp"
                button="none"
            />
            <div  className="mb-3"></div>
            <Footer />
        </div>
    )
}
