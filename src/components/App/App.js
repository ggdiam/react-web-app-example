/**
 * Created by Alexander Sveshnikov on 21/11/16.
 */
import React from 'react';
import './App.scss';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

export default class AppRoot extends React.Component {
    render() {
        return (
            <div className="app">
                <Header/>
                <div className="container">
                    {this.props.children}
                </div>
                <Footer/>
            </div>
        )
    }
}