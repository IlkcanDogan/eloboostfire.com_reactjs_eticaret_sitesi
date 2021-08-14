import React, { useContext, useEffect, useState, useCallback } from 'react'
import Navbar from '../../components/navbar';
import Button from '../../components/button';
import {ColorButton} from '../../components/button';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { AuthContext } from '../../../core/auth';
import app from '../../../core/base';
import { API_URL } from '../../../core/constants';
import Loader from "react-loader-spinner";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import 'react-phone-number-input/style.css'
import PhoneInput, { isPossiblePhoneNumber, formatPhoneNumber, formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input'
import axios from 'axios';
import {
    Accordion,
    AccordionItem,
    AccordionItemButton,
    AccordionItemHeading,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import './style.css';
import $ from 'jquery';

export default function Index() {
    const { currentUser } = useContext(AuthContext);
    const [tabs, setTabs] = useState([]);
    const [selectedTab, setSelectedTab] = useState('');
    const [comboboxs, setComboboxs] = useState({ leftPanel: [], rightPanel: [] })
    const [combinations, setCombinations] = useState([]);
    const [tempComb, setTempComb] = useState([]);
    const [service, setService] = useState({ totalPrice: '', complationTime: '' })
    const [switchs, setSwitchs] = useState([]);
    const [addPrice, setAddPrice] = useState([]);
    const [addSwitch, setAddSwitch] = useState([]);
    const [sAddSwitch, setSAddSwitch] = useState([]);
    const [buy, setBuy] = useState([]);

    useEffect(() => {
        axios.get(API_URL + '/admin/website/tab').then((resp) => {
            //console.log(resp.data);
            if (resp.data.length) {
                setTabs([
                    ...resp.data
                ])
                setSelectedTab(resp.data[0]._id)
                //#region Get Comboboxs
                axios.get(API_URL + '/admin/website/combobox/tab/' + resp.data[0]._id).then((resp) => {
                    if (resp.data.length) {
                        let tempLeft = [];
                        let tempRight = [];
                        resp.data.map((combo, index) => {
                            if (combo.float === 'left') {
                                tempLeft.push({ ...combo });
                            }
                            else {
                                tempRight.push({ ...combo });
                            }
                        })
                        setComboboxs({
                            leftPanel: [
                                ...tempLeft
                            ],
                            rightPanel: [
                                ...tempRight
                            ]
                        })
                    }
                }).catch((err) => {
                    console.log(err);
                })
                //#endregion

                //#region Get Switchs
                axios.get(API_URL + '/admin/website/switch/tab/' + resp.data[0]._id).then((resp) => {
                    if (resp.data.length) {
                        setSwitchs([
                            ...resp.data
                        ])
                    }
                }).catch((err) => {
                    console.log(err);
                })
                //#endregion

                //#region Get Combinations
                axios.get(API_URL + '/admin/website/combination/tab/' + resp.data[0]._id).then((resp) => {
                    if (resp.data.length) {
                        setCombinations([
                            ...resp.data
                        ])
                    }
                }).catch((err) => {
                    console.log(err)
                })
                //#endregion
            }
        }).catch((err) => {
            console.log(err);
        })
    }, [])

    useEffect(() => {
        setService({ totalPrice: '', complationTime: '' })
        setComboboxs({ leftPanel: [], rightPanel: [] })
        setBuy([])
        setAddPrice([])
        setCombinations([])
        setTempComb([])
        setAddSwitch([])
        //#region Get Comboboxs
        axios.get(API_URL + '/admin/website/combobox/tab/' + selectedTab).then((resp) => {
            if (resp.data.length) {
                let tempLeft = [];
                let tempRight = [];
                resp.data.map((combo, index) => {
                    if (combo.float === 'left') {
                        tempLeft.push({ ...combo });
                    }
                    else {
                        tempRight.push({ ...combo });
                    }
                })
                setComboboxs({
                    leftPanel: [
                        ...tempLeft
                    ],
                    rightPanel: [
                        ...tempRight
                    ]
                })
            }
            else {
                setComboboxs({ leftPanel: [], rightPanel: [] })
            }
        }).catch((err) => {
            console.log(err);
        })

        //#endregion
        //#region Get Switchs
        axios.get(API_URL + '/admin/website/switch/tab/' + selectedTab).then((resp) => {
            if (resp.data.length) {
                setSwitchs([
                    ...resp.data
                ])
            }
            else {
                setSwitchs([]);
            }
        }).catch((err) => {
            console.log(err);
        })
        //#endregion
        //#region Get Combinations
        axios.get(API_URL + '/admin/website/combination/tab/' + selectedTab).then((resp) => {
            if (resp.data.length) {
                setCombinations([
                    ...resp.data
                ])
            }
        }).catch((err) => {
            console.log(err)
        })
        //#endregion
    }, [selectedTab])

    const handleSelectChange = (comboId, valuex) => {
        //#region Temp Combinations
        let temp = [
            ...tempComb
        ];
        if (temp.length) {
            let check = true;
            temp.map((data, index) => {
                if (data.id === comboId) {
                    temp[index] = { id: comboId, selectedIndex: valuex }
                    check = false;
                }
            });
            if (check) {
                temp.push({ id: comboId, selectedIndex: valuex })
            }
        }
        else {
            temp.push({ id: comboId, selectedIndex: valuex })
        }

        setTempComb([
            ...temp
        ])
        //#endregion
        //#region Combinations Read 
        let next = false
        combinations.map((data, index) => {
            if (!next) {
                let isOk = [];
                let combination = data.combinations;
                //
                combination.map((comb, index) => {
                    let id = comb.comboboxId;
                    let selectedIndex = comb.selectedIndex;

                    let find = false;
                    temp.map((c, index) => {
                        if (id === c.id && selectedIndex === temp[index].selectedIndex) {
                            find = true;
                        }
                    })
                    isOk.push(find);
                })
                //
                isOk.map((is, index) => {
                    if (!is) {
                        isOk = false;
                    }
                })
                if (isOk) {
                    setService({ totalPrice: data.totalPrice, complationTime: data.complateTime, comId: data._id})
                    next = true;
                }
                else {
                    setService({ totalPrice: '', complationTime: '' })
                }
            }
        })
        //#endregion
    }
    const handleChangePurc = (comboId, valuex, selectedIndex) => {
        let tVal = valuex.split(',')[0];
        let tCon = valuex.split(',')[1];
        let tempAdd = [
            ...addPrice
        ];

        let isOk = false;
        tempAdd.map((cm, index) => {
            if (cm.id === comboId) {
                tempAdd[index] = { id: comboId, price: tVal, coefficient: tCon, selectedIndex: (selectedIndex - 1).toString() }
                isOk = true;
            }
        })

        if (!isOk) {
            tempAdd.push({ id: comboId, price: tVal, coefficient: tCon, selectedIndex: (selectedIndex - 1).toString() });
        }
        setAddPrice([...tempAdd]);
        console.log(tempAdd)
        //console.log("Purc: ", (selectedIndex - 1))
    }

    const handleCalc = (sPrice) => {
        let tempP = 0;
        let tempC = 0;
        addPrice.map((pr, index) => {
            if (pr.price !== 'empty' /*&& pr.price !== '0'*/) {
                tempP += parseFloat(pr.price);
                if(pr.coefficient !== '' && pr.coefficient !== '0' && pr.coefficient !== undefined && pr.coefficient !== "undefined"){
                    tempC += parseFloat(pr.coefficient);
                }
            }
        })
        if (tempP > 0) {
            let tmpPrice = (parseFloat(sPrice) + ((parseFloat(sPrice) * tempP) / 100));
            if(tempC > 0){
                tmpPrice = (tmpPrice * tempC);
            }
            return Number((parseFloat(tmpPrice)).toFixed(2));
        }
        else {
            if(tempC > 0){
                sPrice = (sPrice * tempC);
            }
            return sPrice
        }
    }

    const handleChangeSwitch = (value, price, switchId) => {
        if (value) {
            setAddSwitch([...addSwitch, price]);
        }
        else {
            let tempSwitch = []
            let isOk = false;
            addSwitch.map((tPrice, index) => {
                if (!isOk) {
                    if (tPrice === price) {
                        isOk = true;
                    }
                }
                else {
                    tempSwitch.push(tPrice);
                }
            })
            setAddSwitch([...tempSwitch]);

        }
        if (value) {
            setSAddSwitch([...sAddSwitch, switchId])
        }
        else {
            let tsadd = [];
            sAddSwitch.map((s, index) => {
                if (s !== switchId) {
                    tsadd.push(s);
                }
            })
            setSAddSwitch([...tsadd])
        }
    }

    const switchCalc = (sPrice) => {
        let tempSPrice = 0;
        addSwitch.map((tPrice, index) => {
            tempSPrice += parseFloat(tPrice);
        })
        return Number((parseFloat(parseFloat(tempSPrice) + parseFloat(sPrice))).toFixed(2));
    }

    const handleBuy = () => {
        let allTemp = { combobox: [], percent: [] }

        if (service.totalPrice) {
            let isEmpty = false;
            addPrice.map((data, index) => {
                if (data.price === 'empty') {
                    isEmpty = true;
                }
            })
            if (!addPrice.length) isEmpty = true;
            if ((addPrice.length + tempComb.length) !== (comboboxs.leftPanel.length + comboboxs.rightPanel.length)) isEmpty = true;

            if (isEmpty) {
                window.alert("Please do not leave the options blank!");
            }
            else {
                allTemp = {
                    _tabId: selectedTab,
                    _combId: service.comId,
                    _totalPrice: $('#total-text').html(),
                    _discountPrice: $('#discount-text').html(),
                    _combobox: [...tempComb],
                    _percent: [...addPrice],
                    _switch: [...sAddSwitch],
                }
                setBuy(allTemp);
            }

        }
    }
    
    const comments = [
        {
            username: 'Riccardo Asema',
            message: 'It has a highly skilled booster team compared to other sites.'
        },
        {
            username: 'Milinnae Kratch',
            message: 'A site that does its job very well. It also offers the best service at low prices.'
        },
        {
            username: 'Emily Monste',
            message: 'The site that provides the best elo boost service. I thank you for this.'
        },
        {
            username: 'Jonas Paul',
            message: 'Der Live-Support ist sehr gut. Reagiert sofort, wenn Sie eine Frage haben.'
        }
    ]

    return (
        <div style={{ backgroundColor: '#000' }}>
            <Navbar activeLink="elo-boost" mode={currentUser ? "private" : ""} />
            <Header page="eloboost" />
            {
                selectedTab ? (
                    <div className="container mt-5">
                        <div className="row">
                            <div className="col-12">
                                <center>
                                    <div className="row">
                                        {
                                            tabs.map((tab, index) => {
                                                return (
                                                    <div className="col-4 col-sm-2 col-lg-2" onClick={() => { setSelectedTab(tab._id); console.log(comboboxs) }} id="tab-container" style={{ cursor: 'pointer' }}>
                                                        <img src={tab.imageUrl} className="img-fluid" style={{ maxHeight: 110 }} />
                                                        <label id="tab-text">{tab.title}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </center>
                            </div>
                        </div>

                        {
                            buy._tabId ? (
                                <BuyScreen buyInfo={buy} />
                            ) : (
                                <>
                                    <div className="row mt-2">
                                        <div className="col-12 mt-5 mb-5">
                                            <center><p style={{ color: 'white', fontSize: 35 }}>{
                                                tabs.map((tab, index) => {
                                                    if (tab._id === selectedTab) {
                                                        return (<>{tab.title} SERVICE</>);
                                                    }
                                                })
                                            }</p></center>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-6">
                                            {
                                                comboboxs.leftPanel.map((combo, index) => {
                                                    let purc = false;
                                                    return (
                                                        <>
                                                            <label id="combo-label">{combo.name}</label>
                                                            <select className="form-control mb-2" style={{ fontSize: 14 }} onChange={(e) => purc ? handleChangePurc(combo._id, e.target.value, e.target.options.selectedIndex) : handleSelectChange(combo._id, e.target.value)}>
                                                                <option value="empty">Choose...</option>
                                                                {
                                                                    combo.options.map((option, index) => {
                                                                        if (option.price != '') {
                                                                            purc = true;
                                                                        }
                                                                        return (
                                                                            <option value={purc ? option.price + ',' + option.coefficient : index}>{option.name}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                        </>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="col-6" >
                                            {
                                                comboboxs.rightPanel.map((combo, index) => {
                                                    let purc = false;
                                                    return (
                                                        <>
                                                            <label id="combo-label">{combo.name}</label>
                                                            <select className="form-control mb-2" style={{ fontSize: 14, }} onChange={(e) => purc ? handleChangePurc(combo._id, e.target.value, e.target.options.selectedIndex) : handleSelectChange(combo._id, e.target.value)}>
                                                                <option value="empty">Choose...</option>
                                                                {
                                                                    combo.options.map((option, index) => {
                                                                        if (option.price != '') {
                                                                            purc = true;
                                                                        }
                                                                        return (
                                                                            <option value={purc ? option.price  + ',' + option.coefficient : index}>{option.name}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                        </>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col-12 col-lg-6 mb-4" >
                                            {
                                                switchs.map((sw, index) => {
                                                    return (
                                                        <div class="form-check mb-1">
                                                            <input class="form-check-input" type="checkbox" value="" id={`chk_${index}`} checked={!comboboxs.leftPanel.length ? false : null} onChange={(e) => handleChangeSwitch(e.target.checked, sw.price, sw._id)} />
                                                            <label class="form-check-label" for={`chk_${index}`} id="chk-text">
                                                                {sw.name} <span class="badge badge-secondary" style={{ backgroundColor: 'red' }}>+ {sw.price} €</span>
                                                            </label>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="col-12 col-lg-6" >
                                            <div className="row">
                                                <div className="col-6 col-md-2 col-lg-2">
                                                    {
                                                        service.totalPrice ? (
                                                            <img src="/images/sale_badge.png" style={{ float: 'right' }} className="img-fluid" />
                                                        ) : null
                                                    }
                                                </div>
                                                <div className="col-6 col-md-2 col-lg-2" >
                                                    <span id="discount-text">{service.totalPrice ? switchCalc(handleCalc(service.totalPrice)) * 2 : 0}</span>
                                                    <p id="total-text">{service.totalPrice ? switchCalc(handleCalc(service.totalPrice)).toFixed(2) : 0} €</p>
                                                </div>
                                                <div className="col-12 col-md-8 col-lg-8 pt-3" >
                                                    <center><Button title="Buy Now" onClick={() => handleBuy()} /></center>
                                                </div>
                                            </div>
                                            {
                                                service.complationTime ? (
                                                    <div className="row mt-3">
                                                        <div className="col-12" style={{ textAlign: 'right' }}>
                                                            <span style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Estimated Completion Time:
                                                                <span style={{ fontWeight: 'normal' }}> {service.complationTime} days</span></span>
                                                        </div>
                                                    </div>
                                                ) : null
                                            }
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div>
                ) : (
                    <center className="mt-5">
                        <Loader
                            type="Oval"
                            color="#FFC732"
                            height={80}
                            width={80}
                        />
                    </center>
                )
            }
            {
                comments.map((user, index) => {
                    return (
                        <div className="container p-4" style={{fontFamily: 'TWCenWT, sans-serif'}}>
                            <div className="row">
                                {index === 0 ? <p style={{color: 'white', fontSize: 24}}>Customer Comments</p> : null}
                                <div className="col-12 p-3" style={{backgroundColor: '#FFC732', padding: 20}}>
                                    <div>
                                        <i class="fa fa-user-circle" aria-hidden="true" style={{fontSize: 24}}></i>
                                        <span style={{fontSize: 22}}> {user.username}</span>
                                        <i class="fa fa-comment" aria-hidden="true" style={{fontSize: 24, float: 'right'}}></i>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="row " style={{backgroundColor: '#4f4e4e', color: '#fff'}}>
                                <div className="col-12" style={{paddingTop: 10}}>
                                    <p>{user.message}</p>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            
            <div className="container">
                <div className="row">
                    <div className="col-12 mb-5 mt-5">
                        <Accordion /*preExpanded={['a']}*/ >
                        {
                            tabs.map((tab, index) => {
                                if (tab._id === selectedTab) {
                                    if (tab.title === 'LEAGUE BOOSTING') {
                                        return (
                                                <>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                            What is Eloboost
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                        What is Eloboost, one of the most popular applications of recent times? Do you want to find the answer to the question too? With this guide we have prepared for you, you will find answers to both eloboost and all your other questions about this subject.
                                                        Conceptually, eloboost, which is derived from the combination of the words 'Elo' and 'Boost', is defined as a league of legends ranking process. Elo Boost is the process of improving your position in the professional player's LoL Ranked system by granting a friend of our Professional booster team access to your account. As Eloboostfire, we are at your service to offer you this process in the most convenient, fastest and most reliable way.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                            Can I contact you during my Eloboost service
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                        You can always contact us via the Eloboostfire discord server, and you can also access all the details about your elo boost service from the live support team on our site.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                            How long does the Eloboost process take
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                            Elo boost processes are completed by us as soon as possible. As you know, the league of legends scoring system varies from account to account, so an exact time cannot be given, but you can contact our live support team and learn an estimated time.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                            </>
                                        )
                                }
                                else if(tab.title === 'DUO BOOSTING') {
                                    return (
                                        <>
                                            <AccordionItem id={index} /*uuid='a'*/>
                                                <AccordionItemHeading>
                                                    <AccordionItemButton>
                                                     What is Duoboost
                                                    </AccordionItemButton>
                                                </AccordionItemHeading>
                                                <AccordionItemPanel>
                                                    <p>
                                                    Duoboost stands out for the way you want the rank system related to online games. In this context, you should learn how the process continues before having a duoboost process. Thanks to this guide we have prepared for you, you can get information about the process related to all transactions.
                                                    </p>
                                                </AccordionItemPanel>
                                            </AccordionItem>
                                            <AccordionItem id={index} /*uuid='a'*/>
                                                <AccordionItemHeading>
                                                    <AccordionItemButton>
                                                    How Duoboost Works
                                                    </AccordionItemButton>
                                                </AccordionItemHeading>
                                                <AccordionItemPanel>
                                                    <p>
                                                    In Duo Boost Transactions, while you continue to play on your own account, our booster friend plays with you from a different account. During this process, you can learn all the details by staying in touch with our booster friend assigned to your process by Eloboostfire.
                                                    </p>
                                                </AccordionItemPanel>
                                            </AccordionItem>
                                            <AccordionItem id={index} /*uuid='a'*/>
                                                <AccordionItemHeading>
                                                    <AccordionItemButton>
                                                    Is There a Risk to Gamers with Duoboost
                                                    </AccordionItemButton>
                                                </AccordionItemHeading>
                                                <AccordionItemPanel>
                                                    <p>
                                                    The safety of the players is one of the most important issues for us. For this reason, you can conduct meetings with the booster in order to complete all the processes you desire meticulously. Being in contact with the booster throughout the process will mean a very serious advantage for you. For this reason, you can play your league of legends games as you wish while the duo boost process is taking place.
Thanks to the duo boost processes we have done before, we ensure that you reach the highest quality solutions, while at the same time, we ensure that your performance in the game is affected in a good way.
                                                    </p>
                                                </AccordionItemPanel>
                                            </AccordionItem>
                                            <AccordionItem id={index} /*uuid='a'*/>
                                                <AccordionItemHeading>
                                                    <AccordionItemButton>
                                                    How Much Are Duoboost Prices?
                                                    </AccordionItemButton>
                                                </AccordionItemHeading>
                                                <AccordionItemPanel>
                                                    <p>
                                                    In order to reach the highest quality service, you only have to apply to Eloboostfire for duoboost. We bring prices to reasonable levels, especially for those who want a quality service. It remains only to benefit from the most successful services at the most affordable prices.
                                                    </p>
                                                </AccordionItemPanel>
                                            </AccordionItem>
                                        </>
                                    )
                                }
                                else if(tab.title === 'WIN BOOSTING') {
                                        return (
                                            <>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                        What is Win Boost
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                        Get ready to have a more successful gaming experience by learning the win boost process, which is well known by those who are familiar with Eloboost processes. In this context, all you need to do is to examine the guide we have prepared about winboost with its details.
Winboost is considered as a win-win alternative rather than a leveling option within the scope of eloboost operations. For this reason, when you want to win, it will be enough to consider how many wins you need and all other details. Our Booster team supports you with the highest performance while answering your requests.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                        Who Is Win Boost For
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                        It is necessary to express in detail who will receive support for Winboost operations. Because the key to achieving a correct result is to determine a correct method. There is no need for an extra feature for winboost, which is one of the most ideal options for those who want to play ranked games.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                        Is There a Guarantee for Winboost Transactions
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                        Of course, there is a guarantee for win boost operations. In return for the money you pay, you will receive the promised win. In this way, we ensure that you guarantee your wins. If you want to buy winboost, considering this situation, you should choose one of the most ideal options. You can take advantage of Eloboostfire for quality and high standards you can't find anywhere else.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                        How to Shop Winboost 
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                        It is sufficient to send the request to us during the shopping process and complete the payment process. Therefore, there is no risk that you may encounter during the shopping phase. As Eloboostfire, we do not compromise on quality while promising you special solutions. All you have to do is benefit from our excellent services.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                            </>
                                        )
                                    }
                                    else if(tab.title === 'PLACEMENT MATCHES') {
                                        return (
                                            <>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                        What are Top 10 Matches
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                        The first 10 matches are considered as one of the most curious subjects in the eloboost system. It is possible to talk about many details about what this service is and why it should be preferred. However, while sharing all the details about the first 10 matches with you, we also care about not compromising on quality. Below are all the details about the first 10 matches!
With the first ten matches, it is aimed to determine your level at the beginning of the season and to settle in a new league. All you need to do in order to settle in the league you target is to apply to us within the scope of eloboost transactions with the right application. We offer you the most ideal options with our Booster team!
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                        Is There a Guarantee of First 10 Matches 
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                        The main question mark in the minds of those who receive the Eloboost service is whether there is a guarantee in the boost process. In this context, it is necessary to express the service we offer you more closely. We guarantee eloboost victory for the first 10 matches. Our Booster team ensures that you reach the level you desire by making transactions in accordance with your requests. Moreover, it is only possible to achieve quality results with this method.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                        What Happens If You Lose In The First 10 Matches
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                        Although the most successful results are aimed for the desired level in Boost operations, in case of undesirable situations, you are guaranteed to gain 1 level after the first 10 matches. Of course, 1 level is for each eloboost operation. We guarantee 9 victories for the first 10 matches at Iron, Bronze, Silver Tiers, 8 victories for Platinum and Gold, and 7 victories for Diamond and higher tiers.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                            </>
                                        )
                                    }
                                    else if(tab.title === 'NORMAL MATCHES') {
                                        return (
                                            <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                        What is normal game boosting
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                            For leveling up and earning the leveling capsules which gives blue essance and ores. Also normal game duo boosting offers you having a good time with our team!
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                        )
                                    }
                                    else if(tab.title === 'COACHING') {
                                        return (
                                            <>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                        What is Coaching 
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                        You may want to reach the right solutions with League of Legends Coaching services. For the quality processes waiting for you, you should know what this process means and what it promises.
Thanks to the coaching services, you will be able to get the updates and innovations in the game in the most successful way. This will mean a rapid rise in the game for you. For this reason, you will be able to benefit from the support that no other player can get with us. With Eloboostfire, Professional league of legends booster team, you can become one of the best and strongest players.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                            How coaching happens
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                        The booster team that deals with league of legends coaching is challenger level players. Thanks to a team that has taken part in many teams and does the job in a professional way, you will have the chance to achieve the most ideal results. For this, all you need to do is to choose only quality.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                        Is Coaching Service Guaranteed
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                        It is possible to open the door to a guaranteed process within the framework of the coaching service. Within the framework of the service you will receive regarding the lol coaching service, which is considered a guaranteed service, you will be able to both rise and have a higher quality league of legends knowledge. We recommend meeting with our coaching services for masterful solutions. Because coaching will not only meet your expectations, but also offer you the most ideal results.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                        How are Coaching Services Prices
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                        In order to benefit from the most successful options related to the right price and quality service, there are different aspects that you need to pay attention to. Knowing these issues will be very valuable for you to take action. Otherwise, quality and high standards will not seem possible to you. While we support you in Elo boost processes, we also offer you tailor-made solutions for coaching.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                            </>
                                        )
                                    }
                                    else {
                                        return (
                                                <>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                            What is Eloboost
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                        What is Eloboost, one of the most popular applications of recent times? Do you want to find the answer to the question too? With this guide we have prepared for you, you will find answers to both eloboost and all your other questions about this subject.
                                                        Conceptually, eloboost, which is derived from the combination of the words 'Elo' and 'Boost', is defined as a league of legends ranking process. Elo Boost is the process of improving your position in the professional player's LoL Ranked system by granting a friend of our Professional booster team access to your account. As Eloboostfire, we are at your service to offer you this process in the most convenient, fastest and most reliable way.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                            Can I contact you during my Eloboost service
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                        You can always contact us via the Eloboostfire discord server, and you can also access all the details about your elo boost service from the live support team on our site.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem id={index} /*uuid='a'*/>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                            How long does the Eloboost process take
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                            Elo boost processes are completed by us as soon as possible. As you know, the league of legends scoring system varies from account to account, so an exact time cannot be given, but you can contact our live support team and learn an estimated time.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                            </>
                                        )
                                    }
                                }
                            })
                        }
                        </Accordion>
                    </div>
                </div>
            </div>
            <div className="mt-5"></div>
            <Footer />
        </div>
    )
}

function BuyScreen(props) {
    const { currentUser } = useContext(AuthContext);
    const [steps, setSteps] = useState({ step1: false, step2: false, step3: false });
    const [formData, setFormData] = useState({ email: '', password: '', passwordc: '', errorMessage: '', wait: false })
    const [forgotFormData, setForgotFormData] = useState({ email: '', password: '', errorMessage: '', wait: false })
    const [registerFormData, setRegisterFormData] = useState({ email: '', password: '', errorMessage: '', wait: false })
    const [account, setAccount] = useState({nickname: '', password: '', phone: '', summonerName: '',accountId: '', note: '',check: false, errorMessage: ''});
    const [wait, setWait] = useState(false);
    const [orderNo, setOrderNo] = useState({orderNo: '', totalPrice: '', ibanNo: ''});
 
    const emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

    //#region handles
    const isLoginCheck = () => {
        if (currentUser) {
            if (currentUser.emailVerified) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    const isStep2 = (es) => {
        if(es && !steps.step2) {
            return "active-pre";
        }
        else if(es && steps.step2) {
            return "active";
        }
        else {
            return "";
        }
    }
    const isStep3 = (es) => {
        if(es === 'active' && !steps.step3) {
            return "active-pre";
        }
        else if(es && steps.step3) {
            return "active";
        }
        else {
            return "";
        }
    }
   
    const handleLogin = useCallback(
        async event => {
            if (formData.email && formData.password) {
                setFormData({ ...formData, wait: true });
                try {
                    await app.auth().signInWithEmailAndPassword(formData.email, formData.password).then((user) => {
                        if (user.user.emailVerified) {
                            setFormData({ ...formData, wait: false });
                            setSteps({ ...steps, step1: true })
                        }
                        else {
                            setFormData({ ...formData, wait: false, errorMessage: '* Please verify your account.' })
                        }
                    })
                }
                catch (error) {
                    setFormData({ ...formData, errorMessage: '* Email or password is incorrect.' })
                }
            }
            else {
                setFormData({ ...formData, errorMessage: '* Please type email and password.' })
            }
        },
    )
    const handleForgotPassword = useCallback(
        async event => {
            if (forgotFormData.email) {
                setForgotFormData({ ...forgotFormData, wait: true });
                await app.auth().sendPasswordResetEmail(forgotFormData.email).then((user) => {
                    window.$('#forgot-password-modal').modal('hide');
                    window.$('#success-reset-modal').modal('show');
                    setForgotFormData({ ...forgotFormData, wait: false });
                }).catch((error) => {
                    setForgotFormData({ ...forgotFormData, wait: false, errorMessage: '* Email address not found.' })
                })
            }
            else {
                setForgotFormData({ ...forgotFormData, errorMessage: '* Please type email.' })
            }
        }
    )
    const handleRegister = useCallback(
        async event => {
            if (registerFormData.email && registerFormData.password && registerFormData.passwordc) {
                if (registerFormData.password.length >= 6) {
                    if (registerFormData.password === registerFormData.passwordc) {
                        if (emailPattern.test(registerFormData.email)) {
                            setRegisterFormData({ ...registerFormData, wait: true });
                            try {
                                await app.auth().createUserWithEmailAndPassword(registerFormData.email, registerFormData.password).then((user) => {
                                    app.auth().currentUser.sendEmailVerification().then(() => {
                                        setRegisterFormData({ ...registerFormData, wait: false, password: '', passwordc: '', errorMessage: '' })
                                        window.$('#register-modal').modal('hide');
                                        window.$('#success-register-modal-boost').modal('show');
                                    })
                                })
                            } catch (error) {
                                setRegisterFormData({ ...registerFormData, wait: false, errorMessage: '* ' + error.message })
                            }
                        }
                        else {
                            setRegisterFormData({ ...registerFormData, errorMessage: '* The email address is badly formatted.' })
                        }
                    }
                    else {
                        setRegisterFormData({ ...registerFormData, errorMessage: '* Password does not match.' })
                    }
                }
                else {
                    setRegisterFormData({ ...registerFormData, errorMessage: '* Password should be at least 6 characters.' })
                }
            }
            else {
                setRegisterFormData({ ...registerFormData, errorMessage: '* Please do not leave blank.' })
            }
        }
    )
    
    const uiConfig = {
        signInFlow: "popup",
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccess: () => {
                return false;
            }
        }
    }
    
    const handlePaymentNext = () => {
        if(account.nickname && account.password && account.phone && account.summonerName && account.accountId){
            if(account.check) {
                if(isPossiblePhoneNumber(account.phone) && isValidPhoneNumber(account.phone) && formatPhoneNumber(account.phone) && formatPhoneNumberIntl(account.phone)){
                    setWait(true);
                    axios.post(API_URL + '/admin/order/new', {
                        userId: currentUser.uid,
                        email: currentUser.email,
                        ...props.buyInfo,
                        ...account
                    }).then((resp) => {
                        if(resp.data.status == 'success') {
                            setWait(false);
                            setSteps({step1: true, step2: true, step3: true});
                            setOrderNo({orderNo: resp.data.orderId, totalPrice: resp.data.totalPrice, ibanNo: resp.data.ibanNo});
                        }
                    }).catch((err) => {
                        setWait(false);
                        setAccount({...account, errorMessage: '* Network error! Please try again'})
                        console.log(err)
                    })
                }
                else {
                    setAccount({...account, errorMessage: '* Please enter the phone number in the correct format'});
                }
            }
            else {
                setAccount({...account, errorMessage: '* Please confirm that you have read the privacy and rules'});
            }
        }
        else {
            setAccount({...account, errorMessage: '* Please do not leave blank'});
        }
    }
    //#endregion
    return (
        <>
            <div className="modal fade" id="success-reset-modal" role="dialog" aria-labelledby="success-reset-modal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content" style={{ border: 'none', backgroundColor: 'transparent' }}>
                        <div className="modal-body" id="login-container">
                            <div className="container">
                                <div className="row mt-1">
                                    <div className="col-12">
                                        <form id="login-form">
                                            <center>
                                                <i className="fa fa-check-circle fa-5x" aria-hidden="true" style={{ color: '#FFC732' }}></i><br /><br />
                                                <label style={{ fontSize: 18 }}>
                                                    Check your inbox for the next steps. If you don't receive an email,
                                                    and it's not in your spam folder this could mean you signed up with
                                                    a different address.
                                                </label>
                                            </center>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="forgot-password-modal" role="dialog" aria-labelledby="forgot-password-modal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content" style={{ border: 'none', backgroundColor: 'transparent' }}>
                        <div className="modal-body" id="login-container">
                            <div className="container">
                                <div className="row mt-1">
                                    <div className="col-12">
                                        <form id="login-form">
                                            <div className="form-group">
                                                <label htmlFor="email">Email Address</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    autoComplete="off"
                                                    placeholder="Email"
                                                    value={forgotFormData.email}
                                                    onFocus={() => setForgotFormData({ ...forgotFormData, errorMessage: '' })}
                                                    onChange={(e) => setForgotFormData({ ...forgotFormData, email: e.target.value })}
                                                />
                                                <p className="mt-2" style={{ color: '#eb4034' }}>{forgotFormData.errorMessage}</p>
                                            </div>
                                            <center><Button
                                                icon="fa fa-envelope"
                                                title="Send Reset Link"
                                                mode="icon-and-text"
                                                wait={forgotFormData.wait}
                                                onClick={() => handleForgotPassword()}
                                            />
                                            </center>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="register-modal" role="dialog" aria-labelledby="register-modal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content" style={{ border: 'none', backgroundColor: 'transparent' }}>
                        <div className="modal-body" id="login-container">
                            <div className="container">
                                <div className="row mt-1">
                                    <div className="col-12">
                                        <form id="login-form">
                                            <div className="form-group">
                                                <label htmlFor="email">Email Address</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="email"
                                                    onFocus={() => setRegisterFormData({ ...registerFormData, errorMessage: '' })}
                                                    placeholder="Email"
                                                    autoComplete="off"
                                                    value={registerFormData.email}
                                                    onChange={(e) => setRegisterFormData({ ...registerFormData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="password">Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    autoComplete="off"
                                                    onFocus={() => setRegisterFormData({ ...registerFormData, errorMessage: '' })}
                                                    placeholder="Password"
                                                    value={registerFormData.password}
                                                    onChange={(e) => setRegisterFormData({ ...registerFormData, password: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="passwordc">Confirm Password </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="passwordc"
                                                    autoComplete="off"
                                                    onFocus={() => setRegisterFormData({ ...registerFormData, errorMessage: '' })}
                                                    placeholder="Confirm Password"
                                                    value={registerFormData.passwordc}
                                                    onChange={(e) => setRegisterFormData({ ...registerFormData, passwordc: e.target.value })}
                                                />
                                                <p className="mt-2" style={{ color: '#eb4034' }}>{registerFormData.errorMessage}</p>
                                            </div>
                                            <center><Button
                                                icon="fa fa-user"
                                                title="Register"
                                                mode="icon-and-text"
                                                wait={registerFormData.wait}
                                                onClick={() => handleRegister()}
                                            />
                                            </center>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="success-register-modal-boost" role="dialog" aria-labelledby="success-register-modal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content" style={{ border: 'none', backgroundColor: 'transparent' }}>
                        <div className="modal-body" id="login-container">
                            <div className="container">
                                <div className="row mt-1">
                                    <div className="col-12">
                                        <form id="login-form">
                                            <center>
                                                <i className="fa fa-check-circle fa-5x" aria-hidden="true" style={{ color: '#FFC732' }}></i><br /><br />
                                                <label style={{ fontSize: 18 }}>Please check your email ({registerFormData.email}) to confirm your account.</label>
                                            </center>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-5 mb-3" id="elo-boost-payment-container">
                <div className="row">
                    <div className="col-12">
                        <form id="msform">
                            <ul id="progressbar" style={{ justifyContent: 'center', textAlign: 'center', paddingLeft: 0 }}>
                                <center>
                                    <li className={isLoginCheck() ? "active" : "active-pre"} id="login"><strong>Login</strong></li>
                                    <li className={isStep2(isLoginCheck())} id="account"><strong >Account</strong></li>
                                    <li className={isStep3(isStep2(isLoginCheck()))} id="payment"><strong>Payment</strong></li>
                                </center>
                            </ul>
                        </form>
                    </div>
                </div>
                {
                    isLoginCheck() ? (
                        isStep2(isLoginCheck()) === 'active-pre' && !steps.step3 ? (
                            <div className="container">
                                <div className="row">
                                    <div className="col-12 col-m-4 col-lg-4">
                                        <form id="login-form">
                                            <div className="form-group">
                                                <label htmlFor="nickname" style={{ float: 'left' }}>Name Surname</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="nickname"
                                                    onFocus={() => setAccount({ ...account, errorMessage: '' })}
                                                    placeholder="Name Surname"
                                                    autoComplete="off"
                                                    value={account.nickname}
                                                    onChange={(e) => setAccount({ ...account, nickname: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="password" style={{ float: 'left' }}>Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    onFocus={() => setAccount({ ...account, errorMessage: '' })}
                                                    placeholder="Password"
                                                    autoComplete="off"
                                                    value={account.password}
                                                    onChange={(e) => setAccount({ ...account, password: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phone" style={{ float: 'left' }}>Phone</label>
                                                <PhoneInput
                                                    placeholder="Phone"
                                                    className="form-control"
                                                    value={account.phone}
                                                    onFocus={() => setAccount({ ...account, errorMessage: '' })}
                                                    onChange={(e) => setAccount({ ...account, phone: e })}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-12 col-m-4 col-lg-4">
                                        <form id="login-form">
                                            <div className="form-group">
                                                <label htmlFor="summonerName" style={{ float: 'left' }}>Summoner Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="summonerName"
                                                    onFocus={() => setAccount({ ...account, errorMessage: '' })}
                                                    placeholder="Summoner Name"
                                                    autoComplete="off"
                                                    value={account.summonerName}
                                                    onChange={(e) => setAccount({ ...account, summonerName: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="accountId" style={{ float: 'left' }}>Account ID</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="accountId"
                                                    onFocus={() => setAccount({ ...account, errorMessage: '' })}
                                                    placeholder="Account ID"
                                                    autoComplete="off"
                                                    value={account.address}
                                                    onChange={(e) => setAccount({ ...account, accountId: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="note" style={{ float: 'left' }}>Note</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="note"
                                                    onFocus={() => setAccount({ ...account, errorMessage: '' })}
                                                    placeholder="Note"
                                                    autoComplete="off"
                                                    value={account.note}
                                                    onChange={(e) => setAccount({ ...account, note: e.target.value })}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-12 col-m-4 col-lg-4">
                                        <div className="container mb-2" id="payment-panel">
                                            <div className="row">
                                                <div className="col-12">
                                                    <label style={{float: 'left'}}>Price:</label>
                                                    <label style={{float: 'right'}}>{props.buyInfo._discountPrice} €</label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12" >
                                                    <label style={{float: 'left'}}>Discount:</label>
                                                    <label style={{float: 'right', color:'#fa695f'}}>50%</label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12 mb-2">
                                                    <div style={{border: '1px solid white'}}></div>
                                                </div>
                                                <div className="col-12" >
                                                    <label style={{float: 'left'}}>Total Price:</label>
                                                    <label style={{float: 'right', color:'#5ffa5f'}}>{props.buyInfo._totalPrice}</label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12 mt-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" value="" id="confirm-check" onChange={(e) => setAccount({...account, check: e.target.checked})} />
                                                        <label class="form-check-label" for="confirm-check" id="confirm-check-text">
                                                            I approve all <a href="/privacy" target="_blank">Privacy & Terms</a>, acceptance and delivery.
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12 mt-3">
                                                    <p className="mt-2" style={{ color: '#eb4034' }}>{account.errorMessage}</p>
                                                    <button className="btn btn-success btn-block" disabled={wait} onClick={() => handlePaymentNext()}>
                                                        {
                                                            wait ? (
                                                                <>Please wait...</>
                                                            ) : <>Next<i className="fa fa-arrow-right ml-2" aria-hidden="true"></i></>
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            isStep2(isLoginCheck()) === 'active' && isStep3(isStep2(isLoginCheck())) === 'active-pre' ? (
                                null
                            ) : (
                                <center>
                                    <p style={{color: 'white', fontWeight: 'bold'}}>LAST STEP: AFTER YOUR PAYPAL PAYMENT ACHIEVED YOUR BOOSTING PROCESS WILL BEGIN. </p>
                                    <p style={{color: 'white'}}>IBAN: {orderNo.ibanNo}</p>
                                    <p style={{color: 'white'}}>Order NO: {orderNo.orderNo}</p>
                                    <br/>
                                    <p style={{color: 'white'}}>(DONT FORGET TO INCLUDE YOUR ORDER NO TO THE DESCRIPTION)</p>
                                </center>
                            )
                        )
                    ) : (
                        <>
                            <div className="row">
                                <div className="col-12" >
                                    <center>
                                        <div style={{ maxWidth: 350 }}>
                                            <center>
                                                <div className="col-12">
                                                    <StyledFirebaseAuth
                                                        uiConfig={uiConfig}
                                                        firebaseAuth={firebase.auth()}
                                                    />
                                                </div>
                                            </center>
                                            <center>
                                                <div className="col-5"></div>
                                                <div className="col-2" style={{ color: '#eeeded' }}><center>OR</center></div>
                                                <div className="col-5"></div>
                                            </center>
                                            <form id="login-form">
                                                <div className="form-group">
                                                    <label htmlFor="email" style={{ float: 'left' }}>Email Address</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="email"
                                                        onFocus={() => setFormData({ ...formData, errorMessage: '' })}
                                                        placeholder="Email"
                                                        autoComplete="off"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    />
                                                </div>
                                                <div className="form-group" style={{ textAlign: 'left' }}>
                                                    <label htmlFor="password" style={{ float: 'left' }}>Password</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        autoComplete="off"
                                                        onFocus={() => setFormData({ ...formData, errorMessage: '' })}
                                                        placeholder="Password"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    />
                                                    <p className="mt-2" style={{ color: '#eb4034' }}>{formData.errorMessage}</p>
                                                </div>
                                                <center><Button
                                                    icon="fa fa-user"
                                                    title="Login"
                                                    mode="icon-and-text"
                                                    wait={formData.wait}
                                                    onClick={() => handleLogin()}
                                                />
                                                </center>
                                                <div className="d-flex justify-content-between">
                                                    <label id="register" data-toggle="modal" data-target="#register-modal" className="mt-3" onClick={() => { setRegisterFormData({ email: '', password: '', passwordc: '', errorMessage: '' }); }}>Register</label>
                                                    <label id="forgot-password" data-toggle="modal" data-target="#forgot-password-modal" className="mt-3" onClick={() => { setForgotFormData({ email: '', password: '', passwordc: '', errorMessage: '' }); }}>Forgot Password</label>
                                                </div>
                                            </form>
                                        </div>
                                    </center>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </>
    )
}