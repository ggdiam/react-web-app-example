/**
 * Created by Alexander Sveshnikov on 25.11.16.
 */
import React from 'react';

import {Link} from 'react-router';

export default class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <Link to="/" className="header-link">Tap News</Link>
            </div>
        )
    }
}

