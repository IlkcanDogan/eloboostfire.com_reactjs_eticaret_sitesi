import React,{useContext} from 'react'
import Navbar from '../../components/navbar';
import Header from '../../components/header';
import Section from '../../components/section';
import Footer from '../../components/footer';
import { AuthContext } from '../../../core/auth';
import './style.css';

export default function Index() {
    const { currentUser } = useContext(AuthContext);
    return (
        <div style={{ backgroundColor: '#000' }}>
            <Navbar activeLink="home-page" mode={currentUser ? "private" : ""} />
            <Header page="main" />
            <Section text="left" title="What is Eloboostfire" 
                content="Established by Computer and Software Engineers, 
                Eloboostfire was established to provide quality service with its booster 
                team consisting entirely of professionals by kneading advanced gaming 
                experience and informatics, aiming to provide fast, safe, high 
                quality and affordable League Of Legends Eloboost services to its customers." 
                content2="Eloboostfire supports charities with a certain portion of income from eloboost services"
                poster="images/poster_1.webp"
            />
            <Section text="right" title="Why Eloboostfire" 
                content="Eloboostfire League of Legends has a mission focused on 
                customer satisfaction by providing high quality and safe eloboost services quickly." 
                content2="You can talk to our Booster team, who play at the e-sports level and in some teams, and the Eloboostfire
                management team via voice, text and live chat 24/7, and you can find instant solutions for your questions or problems!"
                poster="images/poster_2.webp"
            />
            <Footer />
        </div>
    )
}
