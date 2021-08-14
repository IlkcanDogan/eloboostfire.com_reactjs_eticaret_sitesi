import React, { useState, useContext, useEffect } from 'react';
import app from '../../../core/base';
import firebase, { auth } from 'firebase';
import { AuthContext } from '../../../core/auth';
import { API_URL } from '../../../core/constants';
import Sidebar from '../../components/sidebar';
import Timestamp from 'react-timestamp';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './style.css';

export default function Dashboard() {
    const [menu, setMenu] = useState('main');

    return (
        <div id="admin-panel-container">
            <Sidebar
                handleLogout={() => app.auth().signOut()}
                menu={menu}
                setMenu={setMenu}
            >   
                {menu === 'main' ? <p>Admin Paneline Hoşgeldiniz!</p> : null}
                {menu === 'account' ? <Account /> : null}
                {menu === 'livesupportpanel' ? <LiveSupportPanel /> : null}
                {menu === 'customers' ? <Customers /> : null}
                {menu === 'pagelayout' ? <PageLayout /> : null}
                {menu === 'addservice' ? <AddService /> : null}
                {menu === 'orders' ? <Orders /> : null}
            </Sidebar>
        </div>
    )
}

function Orders() {
    const [wait, setWait] = useState(true);
    const [allOrders, setAllOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState({orderNo: '', _wait: true});
    useEffect(() => {
        axios.get(API_URL + '/admin/order/all').then((resp) => {
            if (resp.data.length) {
                setAllOrders([
                    ...resp.data
                ]);
                setWait(false);
                console.log(resp.data);
            }
        }).catch((err) => {
            console.log(err);
            setWait(false);
        })
    }, [])

    const handleViewOrder = (orderId,customerId) => {
        setSelectedOrder({orderNo: orderId, _wait: true});
        allOrders.map((order, index) => {
            if(order.orderId == orderId){
                setSelectedOrder({...selectedOrder, orderData: order})
                axios.get(API_URL + '/admin/customers/get/' + order.customerId).then((resp) => {
                    setSelectedOrder({...selectedOrder,_wait: false, customerData: resp.data, orderData: order});
                }).catch((err) => {
                    console.log(err);
                    setSelectedOrder({_wait: false});
                })
            }
        })
    }
    const handleOrderCheck = () => {
        setWait(true)
        axios.post(API_URL + '/payment/check', {
            orderNo: selectedOrder.orderData.orderId
        }).then((resp) => {
            if(resp.data.status !== 'success'){
                window.alert('Bir sorun oluştu. Lütfen tekrar deneyin!');
            }
            else {
                axios.get(API_URL + '/admin/order/all').then((resp) => {
                    if (resp.data.length) {
                        setAllOrders([
                            ...resp.data
                        ]);
                        setWait(false);
                        console.log(resp.data);
                    }
                }).catch((err) => {
                    console.log(err);
                    setWait(false);
                })
            }
            setWait(false)
        }).catch((err) => {
            window.alert('Bir sorun oluştu. Lütfen tekrar deneyin!');
            console.log("Axios Error: ", err)
        })
    }

    const handleOrderComplated = () => {
        setWait(true)
        axios.post(API_URL + '/payment/success', {
            orderNo: selectedOrder.orderData.orderId
        }).then((resp) => {
            if(resp.data.status !== 'success'){
                window.alert('Bir sorun oluştu. Lütfen tekrar deneyin!');
            }
            else {
                axios.get(API_URL + '/admin/order/all').then((resp) => {
                    if (resp.data.length) {
                        setAllOrders([
                            ...resp.data
                        ]);
                        setWait(false);
                        console.log(resp.data);
                    }
                }).catch((err) => {
                    console.log(err);
                    setWait(false);
                })
            }
            setWait(false)
        }).catch((err) => {
            window.alert('Bir sorun oluştu. Lütfen tekrar deneyin!');
            console.log("Axios Error: ", err)
        })
    }

    return (
        <>
            <div class="modal fade" id="order-view-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Sipariş No: {selectedOrder.orderData ? selectedOrder.orderData.orderId: null}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            {
                                selectedOrder._wait ? <center>Please wait...</center> : (
                                    <>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-12 col-lg-6">
                                                    {
                                                        selectedOrder.orderData.detail[0][0].comboNames.map((cn, index) => {
                                                            return (
                                                                <>
                                                                    <div className="form-group">
                                                                        <label>{cn.name}</label>
                                                                        <input value={cn.option} className="form-control" disabled/>
                                                                    </div>
                                                                </>
                                                            )
                                                        })
                                                    }
                                                    <p>Ek Seçenekler</p>
                                                    {
                                                        selectedOrder.orderData.detail[0][1].switchs.map((sw) => {
                                                            return (
                                                                <><label>{sw}</label><br/></>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="col-12 col-lg-6">
                                                    <div className="form-group">
                                                        <label>Ad Soyad</label>
                                                        <input value={selectedOrder.customerData.displayName} className="form-control" disabled/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>E-Posta</label>
                                                        <input value={selectedOrder.customerData.email} className="form-control" disabled/>
                                                    </div>
                                                    {/*<div className="form-group">
                                                        <label>Telefon</label>
                                                        <input value={JSON.parse(selectedOrder.customerData.photoURL).phoneNumber} className="form-control" disabled/>
                                                </div>*/}
                                                    
                                                    <div className="form-group">
                                                        <label>Ad Soyad (Sipariş)</label>
                                                        <input className="form-control" disabled={true} value={selectedOrder.orderData.account[0].nickname} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Sihirdar Adı</label>
                                                        <input className="form-control" disabled={true} value={selectedOrder.orderData.account[0].summonerName} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Hesap Şifresi</label>
                                                        <input className="form-control" disabled={true} value={selectedOrder.orderData.account[0].password} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Hesap ID</label>
                                                        <input className="form-control" disabled={true} value={selectedOrder.orderData.account[0].accountId} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Cep Telefonu</label>
                                                        <input className="form-control" disabled={true} value={selectedOrder.orderData.account[0].phone} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Sipariş Notu</label>
                                                        <textarea className="form-control" disabled={true}>{selectedOrder.orderData.detail[0].note}</textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success" data-dismiss="modal" onClick={() => handleOrderCheck()} >Onayla</button>
                            <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={() => handleOrderComplated()}>Tamamlandı olarak işaretle</button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Kapat</button>
                        </div>
                    </div>
                </div>

            </div>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {
                            wait ? (
                                <div class="spinner-border text-success spinner-border-sm" role="status" >
                                    <span class="sr-only">Loading...</span>
                                </div>
                            ) : null
                        }
                    </div>
                </div>
                <div className="col-12">
                    <div className="table-wrapper-scroll-y my-custom-scrollbar">
                        <table className="table">
                            <thead className="thead-dark sticky-top">
                                <tr style={{ whiteSpace: 'nowrap' }}>
                                    <th scope="col">#</th>
                                    <th scope="col">Sipariş No</th>
                                    <th scope="col">Sipariş Onayı</th>
                                    <th scope="col">Sipariş Durumu</th>
                                    <th scope="col">Kabul Eden Booster</th>
                                    <th scope="col">Ödenen Tutar</th>
                                    <th scope="col">Tarih</th>
                                    <th scope="col">Aksiyon</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allOrders.map((order, index) => {
                                        return (
                                            <tr style={{ whiteSpace: 'nowrap', fontSize: 14 }}>
                                                <th scope="row" style={{ fontWeight: 'normal' }}>{index + 1}</th>
                                                <th scope="row" style={{ fontWeight: 'normal' }}>{order.orderId}</th>
                                                <th scope="row" style={{ fontWeight: 'normal' }}>{order.orderCheck ? 'Onaylandı' : 'Onaylanmadı'}</th>
                                                <th scope="row" style={{ fontWeight: 'normal' }}>{order.discordSuccess ? 'Tamamlandı' : (order.orderCheck ? 'Devam ediyor' : '--')}</th>
                                                <th scope="row" style={{ fontWeight: 'normal' }}>{order.discordAcceptUsername !== '' ? order.discordAcceptUsername : '--'}</th>
                                                <th scope="row" style={{ fontWeight: 'normal' }}>{order.totalPrice} €</th>
                                                <th scope="row" style={{ fontWeight: 'normal' }}>{new Date(order.createdAt).toString().split("GMT")[0]}</th>
                                                <th scope="row">
                                                    <button className="btn btn-sm btn-success" data-toggle="modal" data-target="#order-view-modal" onClick={() => handleViewOrder(order.orderId)}>Görüntüle</button>
                                                </th>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

//#region Screens 
function AddService() {
    const [tabs, setTabs] = useState([]);
    const [selectedTab, setSelectedTab] = useState('');
    const [comboboxs, setComboboxs] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [wait, setWait] = useState(false);
    const [service, setService] = useState({
        totalPrice: '',
        complateTime: '',
        combination: []
    })
    useEffect(() => {
        axios.get(API_URL + '/admin/website/tab').then((resp) => {
            setTabs([...resp.data])
        }).catch((err) => {
            console.log(err);
        })
    }, [])

    useEffect(() => {
        if (!comboboxs.length) {
            setService({
                totalPrice: '',
                complateTime: '',
                combination: []
            })
            setStatusMessage('');
        }
    }, [comboboxs])
    //#region Funcs
    const GetCombobox = (tabId) => {
        if (tabId) {
            axios.get(API_URL + '/admin/website/combobox/tab/' + tabId).then((resp) => {

                try {
                    if (resp.data.length) {
                        let tempCombo = [];
                        let tempService = [];

                        resp.data.map((combobox, index) => {
                            let priceCheck = false;
                            combobox.options.map((option, index) => {
                                if (option.price) {
                                    priceCheck = true;
                                }
                            })
                            if (!priceCheck) {
                                tempCombo.push(combobox)
                                tempService.push({ comboboxId: combobox._id, selectedIndex: "" })
                            }
                        })
                        setComboboxs([...tempCombo]);
                        
                        setService({
                            /*...service,*/
                            combination: [
                                ...tempService
                            ]
                        })

                    }
                    else {
                        setComboboxs([])
                        setService({
                            totalPrice: '',
                            complateTime: '',
                            combination: []
                        })
                        setStatusMessage('');
                    }
                } catch (err) {
                    console.log(err);
                    setComboboxs([]);
                    setStatusMessage('');
                }
            }).catch((err) => {
                console.log(err)
            })
        }
        else {
            setComboboxs([]);
            setStatusMessage('');
        }
    }
    const handleSave = () => {
        let saveCheck = true;
        service.combination.map((comb, index) => {
            if (comb.selectedIndex === "") {
                saveCheck = false;
            }
        })

        if (saveCheck) {
            if (service.totalPrice !== '') {
                if (service.complateTime !== '') {
                    setWait(true);
                    setStatusMessage('')
                    axios.post(API_URL + '/admin/website/combination/add', {
                        tabId: selectedTab,
                        totalPrice: service.totalPrice,
                        complateTime: service.complateTime,
                        combinations: service.combination
                    }).then((resp) => {
                        setStatusMessage('Hizmet eklendi.')
                        setWait(false);
                    }).catch((err) => {
                        console.log(err);
                        setWait(false);
                        setStatusMessage('')
                        window.alert("Veriler kaydedilmedi! Lütfen internet bağlantınızı kontrol edin.")
                    })
                }
                else {
                    window.alert("Lütfen tamamlanma süresini yazın.")
                }
            }
            else {
                window.alert("Lütfen toplam tutarı yazın.")
            }
        }
        else {
            window.alert("Lütfen seçenekleri boş bırakmayın.")
        }
    }
    const handleSelectChange = (id, value) => {
        let tempCombination = [];
        service.combination.map((combo, index) => {
            if (combo.comboboxId === id) {
                tempCombination.push({ comboboxId: id, selectedIndex: value })
            }
            else {
                tempCombination.push({ ...combo })
            }
        })
        setService({
            ...service,
            combination: [...tempCombination]
        })

        let changeCheck = true;
        tempCombination.map((comb, index) => {
            if (comb.selectedIndex === "") {
                changeCheck = false;
            }
        })

        if (changeCheck) {
            axios.post(API_URL + '/admin/website/combination/change/', {
                tabId: selectedTab,
                combinations: tempCombination
            }).then((resp) => {
                if (resp.data.length) {
                    setService({
                        totalPrice: resp.data[0].totalPrice,
                        complateTime: resp.data[0].complateTime,
                        combination: [
                            ...tempCombination
                        ]
                    })
                }
                else {
                    setService({
                        totalPrice: "",
                        complateTime: "",
                        combination: [
                            ...tempCombination
                        ]
                    })
                }
            }).catch((err) => {
                console.log(err);
            })
        }
        else {
            setService({
                totalPrice: "",
                complateTime: "",
                combination: [
                    ...tempCombination
                ]
            })
        }
    }
    //#endregion
    return (
        <div className="container">
            <div className="row">
                <div className="col-6">
                    <div className="card-header">
                        <label>Sekme Seç</label>
                        <select className="form-control" onChange={(e) => { setComboboxs([]); setSelectedTab(e.target.value); GetCombobox(e.target.value); }}>
                            <option value="">Seç...</option>
                            {
                                tabs.map((tab, index) => {
                                    return (
                                        <option value={tab._id}>{tab.title}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    {
                        comboboxs.length ? (

                            <div className="card mt-5 p-3">
                                <label>Toplam Tutar (Euro)</label>
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    placeholder="0"
                                    value={service.totalPrice}
                                    onFocus={() => setStatusMessage('')}
                                    onChange={(e) => setService({ ...service, totalPrice: e.target.value })}
                                />

                                <label>Tamamlanma Süresi</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Örnek: 3-5"
                                    value={service.complateTime}
                                    onFocus={() => setStatusMessage('')}
                                    onChange={(e) => setService({ ...service, complateTime: e.target.value })}
                                />
                                <p style={{color: 'green', fontSize: 15, fontWeight: 'bold'}}>{statusMessage}</p>
                                <button className="btn btn-success mt-2" disabled={wait} onClick={() => handleSave()}>{wait ? 'Kaydediliyor...' : 'Kaydet'}</button>
                            </div>
                        ) : null
                    }
                </div>
                <div className="col-6">
                    {
                        comboboxs.map((combobox, index) => {
                            return (
                                <>
                                    <label>{combobox.name}</label>
                                    <select className="form-control mb-3" onChange={(e) => handleSelectChange(combobox._id, e.target.value)}>
                                        <option value="">Seç...</option>
                                        {
                                            combobox.options.map((option, index) => {
                                                return (
                                                    <option value={index}>{option.name}</option>
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
        </div>
    )
}

function PageLayout() {
    var storage = app.storage()
    const [pageLayout, setPageLayout] = useState({ tab: [] });

    const [pageLayoutCombobox, setPageLayoutCombobox] = useState({ leftPanel: [], rightPanel: [] });
    const [pageLayoutComboboxFake, setPageLayoutComboboxFake] = useState({ leftPanel: [], rightPanel: [] });

    const [pageLayoutSwitch, setPageLayoutSwitch] = useState({ switch: [] })
    const [pageLayoutSwitchFake, setPageLayoutSwitchFake] = useState({ switch: [] });

    const [addNewTab, setAddNewTab] = useState({ imageName: '', title: '', file: null, _wait: false, _error: '' });
    const [addNewCombobox, setNewCombobox] = useState({ name: '', options: [{ name: '', price: '', coefficient: '' },] })
    const [addNewSwitch, setAddNewSwitch] = useState({ name: '', price: '' });

    const [selectedTab, setSelectedTab] = useState('');
    const [selectedCombobox, setSelectedCombobox] = useState('');
    const [selectedSwitch, setSelectedSwitch] = useState('');


    useEffect(() => {
        RefreshTabs();
        RefreshCombobox();
        RefreshSwitch();
    }, [])

    useEffect(() => {
        fake(selectedTab)
    }, [pageLayoutCombobox])

    useEffect(() => {
        fakeSwitch(selectedTab)
    }, [pageLayoutSwitch])

    //#region Switch
    const handleSwitchDelete = () => {
        setAddNewTab({ ...addNewTab, _wait: true });
        axios.get(API_URL + '/admin/website/switch/delete/' + selectedSwitch).then(() => {
            RefreshSwitch();
            setAddNewTab({ ...addNewTab, _wait: false });
        }).catch((err) => {
            setAddNewTab({ ...addNewTab, _wait: false });
            console.log(err);
        })
    }
    const handleAddSwitch = () => {
        setAddNewTab({ ...addNewTab, _wait: true });
        axios.post(API_URL + '/admin/website/switch/add', {
            tabId: selectedTab,
            name: addNewSwitch.name,
            price: addNewSwitch.price
        }).then(() => {
            RefreshSwitch();
            setAddNewTab({ ...addNewTab, _wait: false });
        }).catch((err) => {
            setAddNewTab({ ...addNewTab, _wait: false });
            console.log(err);
        })
    }

    const RefreshSwitch = () => {
        axios.get(API_URL + '/admin/website/switch').then((resp) => {
            setPageLayoutSwitch({
                switch: [
                    ...resp.data
                ]
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    const fakeSwitch = (sId) => {
        try {
            let tempSwitch = [];
            pageLayoutSwitch.switch.map((data) => {
                if (data.tabId === sId) {
                    tempSwitch.push({ ...data });
                }
            })
            setPageLayoutSwitchFake({
                switch: [
                    ...tempSwitch
                ]
            });
            console.log('Switch: ')
        } catch (err) {
            console.log('Switch Error: ', err)
        }
    }
    //#endregion

    //#region Add Combobox
    const fake = (sId) => {
        try {
            let tempLeft = []
            pageLayoutCombobox.leftPanel.map((data) => {
                if (data.tabId === sId) {
                    tempLeft.push({ ...data });
                }
            })

            let tempRight = []
            pageLayoutCombobox.rightPanel.map((data) => {
                if (data.tabId === sId) {
                    tempRight.push({ ...data });
                }
            })

            setPageLayoutComboboxFake({
                leftPanel: [
                    ...tempLeft
                ],
                rightPanel: [
                    ...tempRight
                ]
            })

        }
        catch (error) {

        }
    }

    const handleAddComboboxLeft = () => {
        setAddNewTab({ ...addNewTab, _wait: true });
        axios.post(API_URL + '/admin/website/combobox/add', {
            tabId: selectedTab,
            float: 'left',
            name: addNewCombobox.name,
            options: addNewCombobox.options
        }).then((resp) => {
            setAddNewTab({ ...addNewTab, _wait: false });
            if (resp.data.status === 'success') {
                RefreshCombobox()
            }
        }).catch((err) => {
            console.log(err);
            setAddNewTab({ ...addNewTab, _wait: false });
        })

    }
    const handleComboboxDelete = () => {
        setAddNewTab({ ...addNewTab, _wait: true });
        axios.get(API_URL + '/admin/website/combobox/delete/' + selectedCombobox).then((resp) => {
            setAddNewTab({ ...addNewTab, _wait: false });
            if (resp.data.status === 'success') {
                RefreshCombobox()
            }
        }).catch((err) => {
            console.log(err);
            setAddNewTab({ ...addNewTab, _wait: false });
        })
    }
    const handleAddComboboxRight = () => {
        setAddNewTab({ ...addNewTab, _wait: true });
        axios.post(API_URL + '/admin/website/combobox/add', {
            tabId: selectedTab,
            float: 'right',
            name: addNewCombobox.name,
            options: addNewCombobox.options
        }).then((resp) => {
            setAddNewTab({ ...addNewTab, _wait: false });
            if (resp.data.status === 'success') {
                RefreshCombobox()
            }
        }).catch((err) => {
            console.log(err);
            setAddNewTab({ ...addNewTab, _wait: false });
        })
    }
    const RefreshCombobox = () => {
        axios.get(API_URL + '/admin/website/combobox').then((resp) => {
            let tempLeft = [];
            let tempRight = [];
            try {
                resp.data.map((data) => {
                    if (data.float === 'left') {
                        tempLeft.push(data);
                    }
                    else {
                        tempRight.push(data);
                    }
                })
                setPageLayoutCombobox({
                    leftPanel: [
                        ...tempLeft
                    ],
                    rightPanel: [
                        ...tempRight
                    ]
                })

            }
            catch (err) {
                console.log("Map Error!")
            }

        }).catch((err) => {
            console.log(err);
        })
    }
    //#endregion

    //#region Add New Tab Modal
    const handleDeleteTab = () => {
        setAddNewTab({ ...addNewTab, _wait: true });
        axios.get(API_URL + '/admin/website/tab/delete/' + selectedTab).then((resp) => {
            if (resp.data.status === 'success') {
                RefreshTabs()
                setAddNewTab({ ...addNewTab, _wait: false });
                setSelectedTab('');
            }
        }).catch((err) => {
            console.log(err);
            setAddNewTab({ ...addNewTab, _wait: false });
            setSelectedTab('');
        })
    }
    const RefreshTabs = () => {
        axios.get(API_URL + '/admin/website/tab').then((resp) => {
            //console.log(resp.data)
            setPageLayout({
                ...pageLayout,
                tab: [
                    ...resp.data
                ],
            })
        }).catch((err) => {
            console.log(err);
        })
    }
    const handleAddTabModalImageChange = (e) => {
        try {
            setAddNewTab({ ...addNewTab, imageName: e.target.files[0].name, file: e.target.files[0] });
        } catch (error) {
            setAddNewTab({ ...addNewTab, imageName: '', file: null });
        }
    }

    const handleAddTabModalSave = () => {
        setAddNewTab({ ...addNewTab, _wait: true });
        let randomImageName = uuidv4() + '_' + addNewTab.imageName;
        const uploadTask = storage.ref(`tab_images/${randomImageName}/`).put(addNewTab.file);
        uploadTask.on('state_changed', (snapshot) => {

        }, (error) => {
            setAddNewTab({ imageName: '', title: '', file: null, _wait: false, _error: '* Yeni sekme ekleme hatası!' })
            console.log(error)
        }, () => {
            storage.ref('tab_images').child(randomImageName).getDownloadURL().then(firebaseImageUrl => {
                axios.post(API_URL + '/admin/website/tab/add', {
                    imageUrl: firebaseImageUrl,
                    title: addNewTab.title
                }).then((resp) => {
                    if (resp.data.status === 'success') {
                        RefreshTabs()
                        setAddNewTab({ imageName: '', title: '', file: null, _wait: false, _error: '' })
                    }
                    else {
                        setAddNewTab({ imageName: '', title: '', file: null, _wait: false, _error: '* Yeni sekme ekleme hatası!' })
                    }
                })
            }).catch((err) => {
                setAddNewTab({ imageName: '', title: '', file: null, _wait: false, _error: '* Yeni sekme ekleme hatası!' })
            })
        })
    }
    //#endregion 
    return (
        <>
            <div className="modal fade" id="add-new-tab-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Yeni Sekme Ekle</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" accept="image/*" id="modalTabImageInput" onChange={(e) => handleAddTabModalImageChange(e)} />
                                <label className="custom-file-label" for="modalTabImageInput">{addNewTab.imageName ? addNewTab.imageName : 'Sekme ikonu seç...'}</label>
                            </div>
                            <div className="form-group mt-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tabTitle"
                                    placeholder="Sekme Başlığı"
                                    value={addNewTab.title}
                                    onChange={(e) => setAddNewTab({ ...addNewTab, title: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Kapat</button>
                            <button type="button" className="btn btn-success" disabled={!(addNewTab.file && addNewTab.title) ? true : false} data-dismiss="modal" onClick={() => handleAddTabModalSave()}>Kaydet</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="delete-tab-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Sekme Sil</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Sekmeyi silmek istediğinize emin misiniz?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Kapat</button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => handleDeleteTab()}>Sil</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="combobox-delete-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Sil</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Açılan kutuyu silmek istediğinize emin misiniz?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Kapat</button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => handleComboboxDelete()}>Sil</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="add-new-combobox-left-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Açılan Kutu Ekle</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <label>Açılan Kutu Adı</label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                id="combobox"
                                placeholder=""
                                value={addNewCombobox.name}
                                onChange={(e) => setNewCombobox({ ...addNewCombobox, name: e.target.value })}
                            />
                            <label>Seçenek Ekle</label>
                            <div className="">
                                {
                                    addNewCombobox.options.map((option, index) => {
                                        return (
                                            <div className="row mb-2">
                                                <div className="col-5">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="combobox"
                                                        placeholder="Seçenek adı"
                                                        value={addNewCombobox.options[index].name}
                                                        onChange={(e) => {
                                                            let temp = [...addNewCombobox.options];
                                                            temp[index].name = e.target.value + ''
                                                            setNewCombobox({ ...addNewCombobox, options: temp });
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-3">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="combobox"
                                                        placeholder="%0"
                                                        value={addNewCombobox.options[index].price}
                                                        onChange={(e) => {
                                                            let temp = [...addNewCombobox.options];
                                                            temp[index].price = e.target.value + ''
                                                            setNewCombobox({ ...addNewCombobox, options: temp });
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-3">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="combobox"
                                                        placeholder="0"
                                                        value={addNewCombobox.options[index].coefficient}
                                                        onChange={(e) => {
                                                            let temp = [...addNewCombobox.options];
                                                            temp[index].coefficient = e.target.value + ''
                                                            setNewCombobox({ ...addNewCombobox, options: temp });
                                                        }}
                                                    />
                                                </div>
                                                {index === 0 ? (
                                                    <i class="fa fa-plus fa-lg" onClick={() => setNewCombobox({ ...addNewCombobox, options: [...addNewCombobox.options, { name: '', price: '' }] })} aria-hidden="true" style={{ marginTop: 10, float: 'left', cursor: 'pointer' }}></i>
                                                ) : (
                                                    <i class="fa fa-trash fa-lg" onClick={() => {
                                                        let temp = [...addNewCombobox.options];
                                                        temp.splice(index, 1)
                                                        setNewCombobox({ ...addNewCombobox, options: temp });

                                                    }} aria-hidden="true" style={{ marginTop: 10, float: 'left', cursor: 'pointer', color: 'red' }}></i>
                                                )}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Kapat</button>
                            <button type="button" className="btn btn-success" data-dismiss="modal" onClick={() => handleAddComboboxLeft()}>Kaydet</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="add-new-combobox-right-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Açılan Kutu Ekle</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <label>Açılan Kutu Adı</label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                id="combobox"
                                placeholder=""
                                value={addNewCombobox.name}
                                onChange={(e) => setNewCombobox({ ...addNewCombobox, name: e.target.value })}
                            />
                            <label>Seçenek Ekle</label>
                            <div className="">
                                {
                                    addNewCombobox.options.map((option, index) => {
                                        return (
                                            <div className="row mb-2">
                                                <div className="col-5">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="combobox"
                                                        placeholder="Seçenek adı"
                                                        value={addNewCombobox.options[index].name}
                                                        onChange={(e) => {
                                                            let temp = [...addNewCombobox.options];
                                                            temp[index].name = e.target.value + ''
                                                            setNewCombobox({ ...addNewCombobox, options: temp });
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-3">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="combobox"
                                                        placeholder="+ %0"
                                                        value={addNewCombobox.options[index].price}
                                                        onChange={(e) => {
                                                            let temp = [...addNewCombobox.options];
                                                            temp[index].price = e.target.value + ''
                                                            setNewCombobox({ ...addNewCombobox, options: temp });
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-3">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="combobox"
                                                        placeholder="0"
                                                        value={addNewCombobox.options[index].coefficient}
                                                        onChange={(e) => {
                                                            let temp = [...addNewCombobox.options];
                                                            temp[index].coefficient = e.target.value + ''
                                                            setNewCombobox({ ...addNewCombobox, options: temp });
                                                        }}
                                                    />
                                                </div>
                                                {index === 0 ? (
                                                    <i class="fa fa-plus fa-lg" onClick={() => setNewCombobox({ ...addNewCombobox, options: [...addNewCombobox.options, { name: '', price: '' }] })} aria-hidden="true" style={{ marginTop: 10, float: 'left', cursor: 'pointer' }}></i>
                                                ) : (
                                                    <i class="fa fa-trash fa-lg" onClick={() => {
                                                        let temp = [...addNewCombobox.options];
                                                        temp.splice(index, 1)
                                                        setNewCombobox({ ...addNewCombobox, options: temp });

                                                    }} aria-hidden="true" style={{ marginTop: 10, float: 'left', cursor: 'pointer', color: 'red' }}></i>
                                                )}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Kapat</button>
                            <button type="button" className="btn btn-success" data-dismiss="modal" onClick={() => handleAddComboboxRight()}>Kaydet</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="switch-add-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Ekstra Seçenek Ekle</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="">
                                <div className="row">
                                    <div className="col-8">
                                        <label>Seçenek Adı</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={addNewSwitch.name}
                                            onChange={(e) => setAddNewSwitch({ ...addNewSwitch, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-4">
                                        <label>Fiyat (Euro)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={addNewSwitch.price}
                                            onChange={(e) => setAddNewSwitch({ ...addNewSwitch, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Kapat</button>
                            <button type="button" className="btn btn-success" data-dismiss="modal" onClick={() => handleAddSwitch()}>Kaydet</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="switch-delete-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Sil</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Ekstra seçeneği silmek istediğinize emin misiniz?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Kapat</button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => handleSwitchDelete()}>Sil</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-12 pb-3">
                        {
                            addNewTab._wait ? (
                                <div class="spinner-border text-success spinner-border-sm" role="status" style={{ float: 'left' }}>
                                    <span class="sr-only">Yükleniyor...</span>
                                </div>
                            ) : null
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-12" id="add-tab-pane">
                        {
                            pageLayout.tab.length ? (
                                <div className="row">
                                    {
                                        pageLayout.tab.map((tab) => {
                                            return (
                                                <div className="col-4 col-lg-2 tab-container" onClick={() => { setSelectedTab(tab._id); fake(tab._id); fakeSwitch(tab._id); }}>
                                                    <div style={{ textAlign: 'center', width: '100%' }}>
                                                        {/*<i class="fa fa-pencil fa-lg mr-2" id="tab-edit-icon" aria-hidden="true"></i>*/}
                                                        <i class="fa fa-trash fa-lg" id={`tab-delete-icon${selectedTab !== tab._id ? 'selected' : ''}`} onClick={() => setSelectedTab(tab._id)} data-toggle="modal" data-target="#delete-tab-modal" aria-hidden="true"></i>
                                                    </div>
                                                    <img src={tab.imageUrl} alt={tab.title} className="img-fluid" style={{ height: 140 }} />
                                                    <span style={{ fontWeight: 'bold', fontSize: 16 }}>{tab.title}</span>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className="col-4 col-lg-2 tab-container" style={{ border: '1px dashed black', minHeight: 100 }}>
                                        <span
                                            id="add-new-tab-text"
                                            data-toggle="modal"
                                            style={{ position: 'absolute', top: '45%', left: 0, right: 0 }}
                                            data-target={!addNewTab._wait ? "#add-new-tab-modal" : ''}
                                        >Yeni Sekme Ekle
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <span
                                    id="add-new-tab-text"
                                    data-toggle="modal"
                                    data-target={!addNewTab._wait ? "#add-new-tab-modal" : ''}
                                >Yeni Sekme Ekle
                                </span>
                            )
                        }
                    </div>
                </div>
                {
                    selectedTab ? (
                        <div className="row">
                            <div className="col-12 col-lg-6 mt-2" id="add-tab-pane">
                                {
                                    pageLayoutComboboxFake.leftPanel.length ? (
                                        <>
                                            <div className="container">
                                                {
                                                    pageLayoutComboboxFake.leftPanel.map((combobox, index) => {
                                                        return (
                                                            <div className="row mb-3">
                                                                <div className="col-12">
                                                                    <label style={{ float: 'left' }}>{combobox.name}</label>
                                                                    <label style={{ float: 'right', cursor: 'pointer', color: 'red' }} data-toggle="modal" data-target={!addNewTab._wait ? "#combobox-delete-modal" : ''} onClick={() => setSelectedCombobox(combobox._id)}> <i class="fa fa-trash" aria-hidden="true"></i></label>
                                                                    <select className="form-control">
                                                                        {
                                                                            combobox.options.map((option, index) => {

                                                                                return (
                                                                                    <option value={index}>{option.name}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <span
                                                className="mt-2"
                                                id="add-new-tab-text"
                                                data-toggle="modal"
                                                data-target={!addNewTab._wait ? "#add-new-combobox-left-modal" : ''}
                                                onClick={() => setNewCombobox({ name: '', options: [{ name: '', price: '' },] })}
                                            >Açılan Kutu Ekle</span>
                                        </>
                                    ) : (
                                        <span
                                            id="add-new-tab-text"
                                            data-toggle="modal"
                                            data-target={!addNewTab._wait ? "#add-new-combobox-left-modal" : ''}
                                            onClick={() => setNewCombobox({ name: '', options: [{ name: '', price: '' },] })}
                                        >Açılan Kutu Ekle</span>
                                    )
                                }
                            </div>
                            <div className="col-12 col-lg-6 mt-2" id="add-tab-pane">
                                {
                                    pageLayoutComboboxFake.rightPanel.length ? (
                                        <>
                                            <div className="container">
                                                {
                                                    pageLayoutComboboxFake.rightPanel.map((combobox, index) => {
                                                        return (
                                                            <div className="row mb-3">
                                                                <div className="col-12">
                                                                    <label style={{ float: 'left' }}>{combobox.name}</label>
                                                                    <label style={{ float: 'right', cursor: 'pointer', color: 'red' }} data-toggle="modal" data-target={!addNewTab._wait ? "#combobox-delete-modal" : ''} onClick={() => setSelectedCombobox(combobox._id)}> <i class="fa fa-trash" aria-hidden="true"></i></label>
                                                                    <select className="form-control">
                                                                        {
                                                                            combobox.options.map((option, index) => {
                                                                                return (
                                                                                    <option value={index}>{option.name}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <span
                                                className="mt-2"
                                                id="add-new-tab-text"
                                                data-toggle="modal"
                                                data-target={!addNewTab._wait ? "#add-new-combobox-right-modal" : ''}
                                                onClick={() => setNewCombobox({ name: '', options: [{ name: '', price: '' },] })}
                                            >Açılan Kutu Ekle</span>
                                        </>
                                    ) : (
                                        <span
                                            id="add-new-tab-text"
                                            data-toggle="modal"
                                            data-target={!addNewTab._wait ? "#add-new-combobox-right-modal" : ''}
                                            onClick={() => setNewCombobox({ name: '', options: [{ name: '', price: '' },] })}
                                        >Açılan Kutu Ekle</span>
                                    )
                                }
                            </div>
                        </div>
                    ) : null
                }
                <div className="row">
                    {
                        selectedTab ? (
                            <>
                                <div className="col-12 col-lg-6 mt-2" id="add-tab-pane">
                                    {
                                        pageLayoutSwitchFake.switch.length ? (
                                            <>
                                                {
                                                    pageLayoutSwitchFake.switch.map((swt, index) => {
                                                        return (
                                                            <div className="row mt-1">
                                                                <div className="col-12">
                                                                    <div className="form-check form-switch" style={{ float: 'left' }}>
                                                                        <input className="form-check-input" type="checkbox" />
                                                                        <label className="form-check-label">{swt.name} <span style={{ fontWeight: 'bold' }}>[+{swt.price} €]</span></label>
                                                                    </div>
                                                                    <i class="fa fa-trash" data-toggle="modal" data-target={!addNewTab._wait ? "#switch-delete-modal" : ''} onClick={() => setSelectedSwitch(swt._id)} style={{ float: 'right', marginTop: 5, color: 'red', cursor: 'pointer' }} aria-hidden="true"></i>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                <span
                                                    id="add-new-tab-text"
                                                    data-toggle="modal"
                                                    data-target={!addNewTab._wait ? "#switch-add-modal" : ''}
                                                    onClick={() => setAddNewSwitch({ name: '', price: '' })}
                                                >Ekstra Seçenekler Ekle</span>
                                            </>
                                        ) : (
                                            <span
                                                id="add-new-tab-text"
                                                data-toggle="modal"
                                                data-target={!addNewTab._wait ? "#switch-add-modal" : ''}
                                                onClick={() => setAddNewSwitch({ name: '', price: '' })}
                                            >Ekstra Seçenekler Ekle</span>
                                        )
                                    }
                                </div>

                            </>
                        ) : null
                    }
                </div>
            </div>
        </>
    )
}


function Customers() {
    const [wait, setWait] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    useEffect(() => {
        axios.get(API_URL + '/admin/customers').then((resp) => {
            if (resp.data.status === 'success') {
                if (resp.data.customers.length) {
                    let tmp = resp.data.customers.sort(function (a, b) {
                        var dateA = new Date(a.dateOfRegistration), dateB = new Date(b.dateOfRegistration);
                        return dateB - dateA;
                    });
                    setAllUsers([...tmp]);
                }

            }
            setWait(false);
        }).catch((error) => {
            setWait(false);
        })
    }, [])
    const [selectedUser, setSelectedUser] = useState('');

    //#region Functions
    const handleUserBan = () => {
        setWait(true);
        axios.post(API_URL + '/admin/customers/ban', {
            uid: selectedUser
        }).then((resp) => {
            if (resp.data.status === 'success') {
                let tempUsers = []
                allUsers.map((user, index) => {
                    if (user.uid === selectedUser) {
                        tempUsers.push({
                            ...allUsers[index],
                            ban: true
                        })
                    }
                    else {
                        tempUsers.push(user)
                    }
                })
                setAllUsers([...tempUsers])
            }
            setWait(false);
        }).catch((error) => {
            setWait(false);
        })
    }
    const handleUserBanRemove = () => {
        setWait(true);
        axios.post(API_URL + '/admin/customers/ban/remove', {
            uid: selectedUser
        }).then((resp) => {
            if (resp.data.status === 'success') {
                let tempUsers = []
                allUsers.map((user, index) => {
                    if (user.uid === selectedUser) {
                        tempUsers.push({
                            ...allUsers[index],
                            ban: false
                        })
                    }
                    else {
                        tempUsers.push(user)
                    }
                })
                setAllUsers([...tempUsers])
            }
            setWait(false);
        }).catch((error) => {
            setWait(false);
        })
    }
    const handleUserDelete = () => {
        setWait(true);
        axios.post(API_URL + '/admin/customers/delete', {
            uid: selectedUser
        }).then((resp) => {
            if (resp.data.status === 'success') {
                let tempUsers = []
                allUsers.map((user, index) => {
                    if (user.uid !== selectedUser) {
                        tempUsers.push(user)
                    }
                })
                setAllUsers([...tempUsers])
            }
            setWait(false);
        }).catch((error) => {
            setWait(false);
        })
    }
    const capitalizeTheFirstLetterOfEachWord = (words) => {
        var separateWord = words.toLowerCase().split(' ');
        for (var i = 0; i < separateWord.length; i++) {
            separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
                separateWord[i].substring(1);
        }
        return separateWord.join(' ');
    }
    //#endregion


    return (
        <>
            <div className="modal fade" id="ban-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Dikkat!</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Müşteriyi banlamak istediğinize emin misiniz?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Kapat</button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => handleUserBan()}>Evet</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="delete-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Dikkat!</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Müşteri hesabını silmek istediğinize emin misiniz?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Kapat</button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => handleUserDelete()} >Evet</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="ban-remove-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Dikkat</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Müşteri hesabını aktifleştirmek istediğinize emin misiniz?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Kapat</button>
                            <button type="button" className="btn btn-success" data-dismiss="modal" onClick={() => handleUserBanRemove()} >Evet</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-2 mb-2">
                        {/*<button className="btn btn-warning mb-2" style={{float: 'right'}}>
                        <i className="fa fa-download"></i> 
                    </button> */}
                        {
                            wait ? (
                                <div class="spinner-border text-success spinner-border-sm" role="status" style={{ float: 'left' }}>
                                    <span class="sr-only">Loading...</span>
                                </div>
                            ) : null
                        }
                    </div>
                    <div className="col-10 mb-1">
                        {/*
                        <span>Show </span>
                            <select className="form-select" aria-label="Default select example"> 
                                <option value="0">25</option>
                                <option value="1">50</option>
                                <option value="2">200</option>
                                <option value="3" selected>All</option>
                            </select> 
                        <span> entries</span>
                   */}
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="table-wrapper-scroll-y my-custom-scrollbar">
                            <table className="table">
                                <thead className="thead-dark sticky-top">
                                    <tr style={{ whiteSpace: 'nowrap' }}>
                                        <th scope="col">#</th>
                                        <th scope="col">Eposta</th>
                                        <th scope="col">Ad Soyad</th>
                                        <th scope="col">Telefon</th>
                                        <th scope="col">Kayıt Tarihi</th>
                                        <th scope="col">Aksiyon</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        allUsers.map((user, index) => {
                                            return (
                                                <tr style={{ whiteSpace: 'nowrap' }}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{user.email}</td>
                                                    <td>{user.name ? capitalizeTheFirstLetterOfEachWord(user.name) : '---'}</td>
                                                    <td>{user.phone ? user.phone : '---'}</td>
                                                    <td>{user.dateOfRegistration.replace('GMT', '')}</td>
                                                    <td>
                                                        {
                                                            user.ban ? (
                                                                <i className="fa fa-check fa-lg mr-3" data-toggle="modal" data-target="#ban-remove-modal" onClick={() => setSelectedUser(user.uid)} style={{ color: 'green', cursor: 'pointer' }}></i>
                                                            ) : (
                                                                <i className="fa fa-ban fa-lg mr-3" data-toggle="modal" data-target="#ban-modal" onClick={() => setSelectedUser(user.uid)} style={{ color: 'blue', cursor: 'pointer' }}></i>
                                                            )
                                                        }
                                                        <i className="fa fa-trash fa-lg" data-toggle="modal" data-target="#delete-modal" onClick={() => setSelectedUser(user.uid)} style={{ color: 'red', cursor: 'pointer' }}></i>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


function LiveSupportPanel() {
    const [chatBoxOpen, setChatBoxOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [anonchats, setAnonchats] = useState([]);
    const [userschat, setUserschat] = useState([]);
    const [viewUser, setViewUser] = useState({})
    const [allChat, setAllChat] = useState([]);
    var db = app.database().ref();

    useEffect(() => {
        db.child('anonchats').orderByKey().on('value', anons => {
            let tempChat = [];
            if (anons.exists()) {
                anons.forEach((anon) => {
                    let anonId = anon.key;

                    db.child(`anonchats/${anonId}`).on('value', chatData => {
                        if (chatData.exists()) {
                            let lastModified = chatData.val().lastModified
                            if (lastModified !== undefined) {
                                tempChat.push({
                                    userId: anonId,
                                    userType: 'anon',
                                    date: lastModified,
                                    userData: {
                                        email: ''
                                    }
                                })
                            }
                        }
                    })
                })
            }
            setAnonchats([...tempChat]);
        })

        db.child('users').orderByKey().on('value', users => {
            let tempChat = [];
            if (users.exists()) {
                users.forEach((user) => {
                    let userId = user.key;

                    db.child(`users/${userId}`).on('value', chatData => {
                        if (chatData.exists()) {
                            let lastModified = chatData.val().lastModified;
                            let userData = chatData.val().userData;

                            if (lastModified !== undefined) {
                                tempChat.push({
                                    userId: userId,
                                    userType: 'user',
                                    date: lastModified,
                                    userData: userData
                                })
                            }
                        }
                    })
                })
            }
            setUserschat([...tempChat]);
        })

    }, [])

    const handleMessageSend = () => {
        if (newMessage) {
            if (viewUser.userType === 'anon') {
                let tempMessages = [];
                db.child(`anonchats/${viewUser.userId}`).once('value', data => {
                    if (data.exists()) {
                        tempMessages = data.val().chat;
                    }
                })

                db.child(`anonchats/${viewUser.userId}`).update({
                    chat: [
                        ...tempMessages,
                        {
                            message: newMessage,
                            user: 'server'
                        }
                    ]
                }).then(() => {
                    setNewMessage('');
                }).catch((error) => {
                    console.log(error);
                })
            }
            else {
                let tempMessages = [];
                db.child(`users/${viewUser.userId}`).once('value', data => {
                    if (data.exists()) {
                        tempMessages = data.val().chat;
                    }
                })

                db.child(`users/${viewUser.userId}`).update({
                    chat: [
                        ...tempMessages,
                        {
                            message: newMessage,
                            user: 'server'
                        }
                    ]
                }).then(() => {
                    setNewMessage('');
                }).catch((error) => {
                    console.log(error);
                })
            }
        }
    }

    const ReturnMessages = () => {
        if (viewUser.userType === 'anon') {
            let tempMessages = [];
            db.child(`anonchats/${viewUser.userId}`).on('value', data => {
                if (data.exists()) {
                    tempMessages = data.val().chat;
                }
            })

            return (
                <>
                    {
                        tempMessages.map((data) => {
                            return (
                                <div className="row">
                                    <div className="col-12" style={{ padding: 0 }}>
                                        {
                                            data.user !== "client" ? (
                                                <span id="right-bubble">
                                                    {data.message}
                                                </span>
                                            ) : (
                                                <span id="left-bubble">
                                                    {data.message}
                                                </span>
                                            )
                                        }

                                    </div>
                                </div>
                            )
                        })
                    }
                </>
            )
        }
        else {
            let tempMessages = [];
            db.child(`users/${viewUser.userId}`).on('value', data => {
                if (data.exists()) {
                    tempMessages = data.val().chat;
                }
            })
            return (
                <>
                    {
                        tempMessages.map((data) => {
                            return (
                                <div className="row">
                                    <div className="col-12" style={{ padding: 0 }}>
                                        {
                                            data.user !== "client" ? (
                                                <span id="right-bubble">
                                                    {data.message}
                                                </span>
                                            ) : (
                                                <span id="left-bubble">
                                                    {data.message}
                                                </span>
                                            )
                                        }

                                    </div>
                                </div>
                            )
                        })
                    }
                </>
            )
        }
    }


    useEffect(() => {
        let asg = [
            ...anonchats,
            ...userschat,
        ]
        let tmp = asg.sort(function (a, b) {
            var dateA = new Date(a.date), dateB = new Date(b.date);
            return dateB - dateA;
        });
        setAllChat([
            ...tmp
        ])
    }, [anonchats, userschat])
    return (
        <div className="container">
            <div className="row">
                <div className={`col-12 ${chatBoxOpen ? 'col-lg-6' : ''}`} style={{ padding: 0 }}>
                    <div className="table-wrapper-scroll-y my-custom-scrollbar">
                        <table className="table">
                            <thead className="thead-dark fixed">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Eposta/ID</th>
                                    <th scope="col">Son Mesaj</th>
                                    <th scope="col">Aksiyon</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allChat.map((user, index) => {
                                        return (
                                            <tr style={{ fontSize: 14 }}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{user.userData.email ? user.userData.email : user.userId}</td>
                                                <td>
                                                    <Timestamp relative date={user.date} autoUpdate />
                                                </td>
                                                <td>
                                                    <button style={{ fontSize: 12 }} onClick={() => { setViewUser(user); setChatBoxOpen(true) }} className="btn btn-primary btn-small">
                                                        Görüntüle
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                {/*
                                    userschat.map((user, index) => {
                                        return (
                                            <tr style={{fontSize: 14}}>
                                                <th scope="row">{index + 1 + anonchats.length }</th>
                                                <td>{user.userData.email}</td>
                                                <td>
                                                    <Timestamp relative date={user.date} autoUpdate />
                                                </td>
                                                <td>
                                                    <button style={{fontSize: 12}} onClick={() => { setViewUser(user); setChatBoxOpen(true)}} className="btn btn-primary btn-small">
                                                        Görüntüle
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })*/
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {
                    chatBoxOpen ? (
                        <div className="col-12 col-lg-6" >
                            <div className="container" id="chat-container"  >
                                <div className="row bg-dark" id="chat-area-title">
                                    <div className="col-12 ">
                                        <span style={{ float: 'left', cursor: 'pointer', fontSize: 15 }} onClick={() => { setChatBoxOpen(false); setViewUser({}) }}><i className="fa fa-close"></i></span>
                                        <span style={{ float: 'right', cursor: 'pointer', fontSize: 15, }}>Müşteri: {viewUser.userType === 'anon' ? viewUser.userId : viewUser.userData.email}</span>


                                    </div>
                                </div>
                                <div className="row" id="chat-area" style={{ border: '1px solid #e2dddd' }}>
                                    <div className="col-12">
                                        <div className="container">
                                            <ReturnMessages />
                                        </div>
                                    </div>
                                </div>
                                <div className="row" id="chat-toolbox">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Mesaj yaz..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' ? handleMessageSend() : {}}
                                        />
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-secondary" type="button" onClick={() => handleMessageSend()}>Gönder</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null
                }
            </div>
        </div>
    )
}


function Account() {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', newPasswordConfirm: '', _wait: false, _status: { type: '', message: '' } })
    const { currentUser } = useContext(AuthContext);
    const returnCred = (pass) => {
        return firebase.auth.EmailAuthProvider.credential(currentUser.email, pass);
    }

    const handlePasswordChange = () => {
        if (form.currentPassword && form.newPassword && form.newPasswordConfirm) {
            if (form.newPassword.length >= 6) {
                if (form.newPassword === form.newPasswordConfirm) {
                    setForm({ ...form, _wait: true });
                    var cred = returnCred(form.currentPassword);
                    currentUser.reauthenticateWithCredential(cred).then(() => {
                        currentUser.updatePassword(form.newPassword).then(() => {
                            setForm({
                                currentPassword: '', newPassword: '', newPasswordConfirm: '', _status: {
                                    type: 'success',
                                    message: 'Şifre Değiştirme Başarılı!',
                                    _wait: false
                                }
                            })
                        }).catch(() => {
                            setForm({
                                ...form, _status: {
                                    type: 'error',
                                    message: '* Eski şifreniz hatalı.',
                                    _wait: false
                                }
                            })
                        })

                    }).catch((error) => {
                        setForm({
                            ...form, _status: {
                                type: 'error',
                                message: '* Eski şifreniz hatalı.',
                                _wait: false
                            }
                        })
                    })
                }
                else {
                    setForm({
                        ...form, _status: {
                            type: 'error',
                            message: '* Yeni Şifreniz eşleşmiyor.',
                        }
                    })
                }
            }
            else {
                setForm({
                    ...form, _status: {
                        type: 'error',
                        message: '* Şifre en az 6 karakterli olmalıdır.',
                    }
                })
            }
        }
        else {
            setForm({
                ...form, _status: {
                    type: 'error',
                    message: '* Lütfen boş bırakmayın.',
                }
            })
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 col-lg-6">
                    <div>
                        <div className="form-group">
                            <label for="currentPassword">Eski Şifre</label>
                            <input
                                type="password"
                                className="form-control"
                                id="currentPassword"
                                placeholder="Eski Şifre"
                                value={form.currentPassword}
                                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                                onFocus={() => setForm({ ...form, _status: { type: '', message: '' } })}
                            />
                        </div>
                        <div className="form-group">
                            <label for="newPassword">Yeni Şifre</label>
                            <input
                                type="password"
                                className="form-control"
                                id="newPassword"
                                placeholder="Yeni Şifre"
                                value={form.newPassword}
                                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                onFocus={() => setForm({ ...form, _status: { type: '', message: '' } })}
                            />
                        </div>
                        <div className="form-group">
                            <label for="newPasswordConfirm">Yeni Şifre (Tekrar)</label>
                            <input
                                type="password"
                                className="form-control"
                                id="newPasswordConfirm"
                                placeholder="Yeni Şifre (Tekrar)"
                                value={form.newPasswordConfirm}
                                onChange={(e) => setForm({ ...form, newPasswordConfirm: e.target.value })}
                                onFocus={() => setForm({ ...form, _status: { type: '', message: '' } })}
                            />
                        </div>
                        {form._status.type === 'error' ? <p style={{ color: 'red', fontSize: 14, fontWeight: 'bold' }}>{form._status.message}</p> : null}
                        {form._status.type === 'success' ? <p style={{ color: 'green', fontSize: 14, fontWeight: 'bold' }}>{form._status.message}</p> : null}
                        <p style={{ color: 'red', fontSize: 14, fontWeight: 'bold' }}>{form._message}</p>
                        <button className="btn btn-success" disabled={form._wait} onClick={() => handlePasswordChange()} style={{ float: 'right' }}>
                            Şifreyi Değiştir
                        </button>
                    </div>
                </div>
                <div className="col-12 col-lg-6">

                </div>
            </div>
        </div>
    )
}
//#endregion