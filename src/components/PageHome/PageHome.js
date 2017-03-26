/**
 * Created by Alexander Sveshnikov on 21/11/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

import * as commonActions from '../../actions/commonActions';
import * as homePageActions from '../../actions/homePageActions';
import {fetchNeeds} from '../../common/fetchComponentData';

import * as htmlHelper from '../../helpers/htmlHelper';

import ItemsList from '../ItemsList/ItemsList';
import * as dataHelper from '../../helpers/dataHelper';

class PageHome extends React.Component {

    /** @type {PageHomeProps} */
    props;

    //Data that needs to be called before rendering the component
    //This is used for server side rending via the fetchComponentDataBeforeRending() method
    static needs = [
        homePageActions.getPageData
    ];

    componentDidMount() {
        //устареют через 10 минут
        if (dataHelper.needToReloadData(this.props.items, this.props.timestamp)) {
            fetchNeeds(PageHome.needs, this.props);
        }

        var title = htmlHelper.getTitle();
        this.props.dispatch(commonActions.setTitle(title));

        window.addEventListener("resume", this.onResume);
    }

    componentWillUnmount() {
        window.removeEventListener("resume", this.onResume);
    }

    onResume = () => {
        // console.log('onResume', new Date());
        fetchNeeds(PageHome.needs, this.props);
        // window.location.reload();
    };

    render() {
        return (
            <div className="page page-main">
                <ItemsList
                    moreLinkTo={(/**ItemModel*/item) => `/category/${item.catUid}`}
                    withCategories={true}
                    items={this.props.items}
                    hasMore={this.props.hasMore}
                    itemsLoading={this.props.itemsLoading}
                    openItemId={this.props.openItemId}
                    setOpenItem={this.setOpenItem}
                    loadMore={this.loadMore}
                />
            </div>
        )
    }

    setOpenItem = (itemId) => {
        //noinspection JSUnresolvedFunction
        this.props.dispatch(homePageActions.setOpenItemId(itemId))
    };

    loadMore = () => {
        //noinspection JSUnresolvedFunction,JSUnresolvedVariable
        this.props.dispatch(homePageActions.getNextPageData());
    };
}

class PageHomeProps {
    /** @type {string} */
    title;
    /** @type {number} */
    timestamp;
    /** @type {CategoryWithItemsModel[]} */
    items = [];
    /** @type {boolean} */
    hasMore;
    /** @type {boolean} */
    itemsLoading;
    /** @type {number} */
    openItemId;

    router;
}

/**@param {RootState} state */
function mapStateToProps(state) {
    /** @type {PageHomeProps} */
    var props = new PageHomeProps();
    props.title = state.common.title;
    props.timestamp = state.homePage.timestamp;
    props.items = state.homePage.items;
    props.hasMore = state.homePage.hasMore;
    props.itemsLoading = state.homePage.itemsLoading;
    props.openItemId = state.homePage.openItemId;

    return Object.assign({}, props);
}

export default connect(mapStateToProps)(PageHome)