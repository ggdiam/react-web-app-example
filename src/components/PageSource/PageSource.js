/**
 * Created by Alexander on 16.12.2016.
 */

import React from 'react';
import {connect} from 'react-redux';

import * as sourcePageActions from '../../actions/sourcePageActions';
import {fetchNeeds} from '../../common/fetchComponentData';

import * as htmlHelper from '../../helpers/htmlHelper';

import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

import ItemsList from '../ItemsList/ItemsList';

class PageSource extends React.Component {
    static needs = [
        sourcePageActions.getPageData
    ];

    /** @type {PageSourceProps} */
    props;

    constructor(props) {
        super(props);

        //для оптимизации handleScroll
        this.categoryFixedStyle = false;
    }

    componentDidMount() {
        fetchNeeds(PageSource.needs, this.props);

        this.handleScroll();
        window.addEventListener('scroll', this.handleScroll);

        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        if (this.props.items.length > 0) {
            var element = document.getElementById('cat_name');
            var className = 'page__title_fixed';
            var scrollOffset = 80;
            var scrollTop = htmlHelper.getScrollTop();

            if (scrollTop > scrollOffset && !this.categoryFixedStyle) {
                this.categoryFixedStyle = true;
                htmlHelper.addClass(element, className);
            }
            else if (scrollTop <= scrollOffset && this.categoryFixedStyle) {
                this.categoryFixedStyle = false;
                htmlHelper.removeClass(element, className);
            }
        }
    };

    render() {
        var sourceName = '';
        if (this.props.items.length > 0) {
            sourceName = this.props.items[0].sourceName;
        }

        return (
            <div className="page page-category">
                {
                    sourceName ?
                        <div id="cat_name" className="page__title">
                            <div className="category">
                                <div className="category-title">
                                    <div className="category-title-name">{sourceName}</div>
                                    <div className="category-edge"></div>
                                    <div className="category-right-edge"></div>
                                </div>
                                <div className="category-bot-edge"></div>
                            </div>
                        </div>
                        : null
                }

                <ItemsList
                    hideMoreLink={true}
                    items={this.props.items}
                    hasMore={this.props.nextPage != null}
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
        this.props.dispatch(sourcePageActions.setOpenItemId(itemId))
    };

    loadMore = () => {
        //noinspection JSUnresolvedFunction,JSUnresolvedVariable
        this.props.dispatch(sourcePageActions.getPageData(this.props.params, this.props.nextPage));
    };
}

class PageSourceProps {
    /** @type {ItemModel[]} */
    items;
    /** @type {NextPrevModel} */
    nextPage = null;
    /** @type {boolean} */
    itemsLoading;
    /** @type {number} */
    openItemId;
}

/**@param {RootState} state */
function mapStateToProps(state) {
    /** @type {PageSourceProps} */
    var props = new PageSourceProps();
    props.items = state.sourcePage.items;
    props.nextPage = state.sourcePage.nextPage;
    props.itemsLoading = state.sourcePage.itemsLoading;
    props.openItemId = state.sourcePage.openItemId;

    return Object.assign({}, props);
}

export default connect(mapStateToProps)(PageSource)