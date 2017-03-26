/**
 * Created by Alexander Sveshnikov on 29.11.16.
 */

import React from 'react';
import {connect} from 'react-redux';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

import * as categoryPageActions from '../../actions/categoryPageActions';
import {fetchNeeds} from '../../common/fetchComponentData';

import * as htmlHelper from '../../helpers/htmlHelper';

import ItemsList from '../ItemsList/ItemsList';

class PageCategory extends React.Component {
    static needs = [
        categoryPageActions.getPageData
    ];

    /** @type {PageCategoryProps} */
    props;

    constructor(props) {
        super(props);

        //для оптимизации handleScroll
        this.categoryFixedStyle = false;
    }

    componentDidMount() {
        fetchNeeds(PageCategory.needs, this.props);

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
        var categoryName = '';
        if (this.props.items.length > 0) {
            categoryName = this.props.items[0].catName;
        }

        return (
            <div className="page page-category">
                {
                    categoryName ?
                        <div id="cat_name" className="page__title">
                            <div className="category">
                                <div className="category-title">
                                    <div className="category-title-name">{categoryName}</div>
                                    <div className="category-edge"></div>
                                    <div className="category-right-edge"></div>
                                </div>
                                <div className="category-bot-edge"></div>
                            </div>
                        </div>
                        : null
                }

                <ItemsList
                    moreLinkTo={(/**ItemModel*/item)=> `/source/${item.sourceId}`}
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
        this.props.dispatch(categoryPageActions.setOpenItemId(itemId))
    };

    loadMore = () => {
        //noinspection JSUnresolvedFunction,JSUnresolvedVariable
        this.props.dispatch(categoryPageActions.getPageData(this.props.params, this.props.nextPage));
    };
}

class PageCategoryProps {
    /** @type {string} */
    title;
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
    /** @type {PageCategoryProps} */
    var props = new PageCategoryProps();
    props.title = state.common.title;
    props.items = state.categoryPage.items;
    props.nextPage = state.categoryPage.nextPage;
    props.itemsLoading = state.categoryPage.itemsLoading;
    props.openItemId = state.categoryPage.openItemId;

    return Object.assign({}, props);
}

export default connect(mapStateToProps)(PageCategory)