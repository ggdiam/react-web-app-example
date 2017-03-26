/**
 * Created by Alexander Sveshnikov on 21/11/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';

import * as homePageActions from '../../actions/homePageActions';
import { fetchNeeds } from '../../common/fetchComponentData';

class PageAbout extends React.Component {

    static needs = [
        homePageActions.getPageData
    ];

    componentDidMount() {
        fetchNeeds(PageAbout.needs, this.props);
    }

    render() {
        return (
            <div>
                <div>
                    About page
                    {
                        this.props.params.id ?
                            <span>, params id: {this.props.params.id}</span>
                        : null
                    }
                    {
                        this.props.test ?
                            <div>test data: {this.props.test}</div>
                        : null
                    }
                </div>
                <Link to="/">Home</Link>
            </div>
        )
    }
}

class PageAboutProps {
    test;
}

/**@param {RootState} state */
function mapStateToProps(state) {
    /** @type {PageAboutProps} */
    var props = new PageAboutProps();
    props.test = state.homePage.test;

    return Object.assign({}, props);
}

export default connect(mapStateToProps)(PageAbout)