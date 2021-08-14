import React, { useState } from 'react'
import './style.css';

export default function Sidebar(props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="wrapper">
            <nav id="sidebar" className={sidebarOpen ? 'active' : ''}>
                <div className="sidebar-header">
                    <h3>Admin Panel</h3>
                </div>

                <ul className="list-unstyled components">
                    <li onClick={() => {props.setMenu('customers'); setSidebarOpen(false)}}>
                        <a href="#customers"><i className="fa fa-users"></i> Müşteriler</a>
                    </li>
                    <li onClick={() => {props.setMenu('orders'); setSidebarOpen(false)}}>
                        <a href="#orders"><i className="fa fa-th-list"></i> Siparişler</a>
                    </li>
                    <li onClick={() => {props.setMenu('livesupportpanel'); setSidebarOpen(false)}}>
                        <a href="#live-support-chat"><i className="fa fa-comments"></i> Canlı Destek Paneli</a>
                    </li>
                    <li>
                        <a href="#pageSubmenuServices" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
                            <i className="fa fa-cube"></i> Hizmetler
                        </a>
                        <ul className="collapse list-unstyled" id="pageSubmenuServices">
                            <li onClick={() => {props.setMenu('addservice'); setSidebarOpen(false)}}>
                                <a href="#add-service"><i className="fa fa-plus"></i> Hizmet Ekle</a>
                            </li>
                            <li onClick={() => {props.setMenu('pagelayout'); setSidebarOpen(false)}}>
                                <a href="#page-layout"><i className="fa fa-columns"></i> Sayfa Düzeni</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#pageSubmenuSettings" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
                            <i className="fa fa-cogs"></i> Genel Ayarlar
                        </a>
                        <ul className="collapse list-unstyled" id="pageSubmenuSettings">
                            <li onClick={() => {props.setMenu('account'); setSidebarOpen(false)}}>
                                <a href="#account"><i className="fa fa-user"></i> Hesap</a>
                            </li>
                        </ul>
                    </li>
                </ul>

                <ul className="list-unstyled CTAs">
                    <p>www.eloboostfire.com</p>
                </ul>
            </nav>

            <div id="content">
                <nav className="navbar-admin navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <button type="button" id="sidebarCollapse" className="btn btn-dark" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <i className="fa fa-align-left"></i>
                        </button>
                        <button className="btn btn-primary d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="fa fa-align-justify"></i>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="nav navbar-nav ml-auto">
                                {/*<li className="nav-item dropdown">
                                    <a className="nav-link" style={{backgroundColor: '#F8F9FA'}} data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"><i className="fa fa-bell"></i> Bildirimler (2)</a>
                                    <div class="dropdown-menu">
                                        <a class="dropdown-item" href="#" style={{fontSize: 14}}>Yeni sipariş (2)</a>
                                    </div>
                                </li>*/}
                                <li className="nav-item" id="mn-link">
                                    <a className="nav-link" href="#" onClick={() => props.handleLogout()}><i className="fa fa-sign-out"></i> Çıkış Yap</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                {props.children}
            </div>
        </div>
    )
}