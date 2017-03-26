/**
 * Created by Alexander on 13.12.2016.
 */
import React from 'react';

import * as htmlHelper from '../../helpers/htmlHelper';
import {trackEvent,proxyUrlsInContent,proxyHttpUrl,getLinkKey} from '../../helpers/helper';

import {Link} from 'react-router';
import InfiniteList from '../InfiniteList/InfiniteList';

export default class ItemsList extends React.Component {
    /** @type {ItemsListProps} */
    props;

    //для запоминания позиции скрола перед раскрытием нового элемента
    beforeExpandOffsetTop;
    beforeExpandBodyScrollTop;

    lastItems = [];

    componentDidMount() {
        window.addEventListener("scroll", this.scrollProcess);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
    }

    scrollProcess = () => {
        var scrollElement = document.getElementsByClassName('scroll-to-next')[0];

        if (scrollElement) {
            var isVisible = false;

            var item = this.lastItems.length > 0 ? this.lastItems[0] : null;
            if (item) {
                var element = item.element;
                var screenHeight = htmlHelper.getScreenSize().y;

                var from = element.offsetTop;
                var to = element.offsetTop + element.offsetHeight - screenHeight - screenHeight / 4;

                if (element.offsetHeight > screenHeight
                    && document.body.scrollTop > from
                    && document.body.scrollTop < to) {
                    isVisible = true;
                }
            }

            if (isVisible) {
                htmlHelper.removeClass(scrollElement, 'scroll-to-next_invisible');
            }
            else {
                htmlHelper.addClass(scrollElement, 'scroll-to-next_invisible');
            }
        }
    };

    render() {
        if (this.props.withCategories) {
            return (
                <div>
                    {
                        this.props.items.length > 0 ?
                            <InfiniteList
                                hasMore={this.props.hasMore}
                                loadMore={this.props.loadMore}
                                loadingMore={this.props.itemsLoading}
                                offset={900}
                            >
                                {this.props.items.map(this.renderCategory)}
                            </InfiniteList>
                            : null
                    }
                </div>
            )
        }
        else {
            return (
                <div className="page__items">
                    {
                        this.props.items.length > 0 ?
                            <InfiniteList
                                hasMore={this.props.hasMore}
                                loadMore={this.props.loadMore}
                                loadingMore={this.props.itemsLoading}
                                offset={900}
                            >
                                {this.props.items.map(this.renderItem)}
                            </InfiniteList>
                            : null
                    }
                </div>
            )
        }
    }

    /**
     * @param {CategoryWithItemsModel} dataItem
     */
    renderCategory = (dataItem, ix) => {
        var category = dataItem.category;

        if (dataItem.items.length > 0) {
            var firstItem = dataItem.items[0];
            var isItemOpened = getLinkKey(firstItem.link, firstItem.guid) == this.props.openItemId;

            return (
                <div key={ix} className="category-item"
                     ref={(ref) => {
                         //корректируем позицию скрола
                         if (this.props.withCategories && isItemOpened && ref && this.beforeExpandOffsetTop) {
                             this.correctScrollPosition(ref);
                         }
                     }}>
                    <Link to={`/category/${category.uid}`} className="page__title">
                        <div className="category">
                            <div className="category-title">
                                <div className="category-title-name">{category.name}</div>
                                {/*<div className="category-title-sign">{'>'}</div>*/}
                                <div className="category-edge"></div>
                                <div className="category-right-edge"></div>
                            </div>
                            <div className="category-bot-edge"></div>
                        </div>
                    </Link>


                    <div className="page__items">
                        {
                            dataItem.items.map(this.renderItem)
                        }
                    </div>
                </div>
            )
        }

        return null;
    };

    /**
     * @param {ItemModel} item
     */
    renderItem = (item, ix) => {
        /** @type {Date} */
        var pubDate = item.pubDate ? new Date(item.pubDate) : null;

        var formattedDate = htmlHelper.getFormattedDate(pubDate);

        //ToDo: debug
        // if (item.description.indexOf('iframe') > -1) {
        //     console.log('item.description', item.description);
        //     item.description = '';
        // }

        //ToDo: debug
        // item.imageUrl = ix % 2 == 0 ? '' : item.imageUrl;

        var isItemOpened = getLinkKey(item.link, item.guid) == this.props.openItemId;
        var hideMoreLink = this.props.hideMoreLink;

        var descriptionHtml = proxyUrlsInContent(item.description);

        return (
            <div key={ix} className={`item ${isItemOpened ? 'item_expanded' : ''}`}
                 ref={(ref) => {
                     //корректируем позицию скрола
                     if (!this.props.withCategories && isItemOpened && ref && this.beforeExpandOffsetTop) {
                         this.correctScrollPosition(ref);
                     }
                 }}
                 onClick={(e) => this.handleItemClick(e, item, ix)}>

                {
                    item.imageUrl ?
                        <div className={`item__img ${isItemOpened ? 'item__img_expanded' : '' }`}>
                            <img className="item-img" src={proxyHttpUrl(item.imageUrl)} />
                        </div>
                        : null
                }

                <div className="item__body">
                    <div className="item-body">
                        <div className={`item__title ${item.imageUrl ? '' : 'item_no-img'}`}>
                            <div className="item-title" dangerouslySetInnerHTML={{__html: item.title}}></div>
                        </div>

                        {
                            isItemOpened ?
                                <div className="item__content">
                                    <div className="item-content"
                                         dangerouslySetInnerHTML={{__html: descriptionHtml}}></div>

                                    <div className="scroll-to-next scroll-to-next_invisible">
                                        <a href="#" onClick={this.handleGotoNext} className="scroll-to-next__link">
                                            <i className="icon-angle-double-down" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </div>
                                : null
                        }

                        {
                            isItemOpened ?
                                <div className="item__link">
                                    <div className="item-link">
                                        <a target="_blank;" href={item.link}>Посмотреть на {item.sourceName}</a>
                                    </div>
                                </div>
                                : null
                        }

                        <div className="item__source">
                            {item.sourceName}
                        </div>
                        {
                            pubDate ?
                                <div className="item__date">
                                    {/*<div className="item-date">{pubDate.toLocaleTimeString()}</div>*/}
                                    <div className="item-date">{formattedDate}</div>
                                </div>
                                : null
                        }
                    </div>
                </div>
                {
                    hideMoreLink ? null :
                        <Link to={this.props.moreLinkTo(item)} className="more" onClick={(e) => {
                            e.stopPropagation();
                        }}>
                            <div className="more-title">
                                <div className="more-title-name">Еще</div>
                            </div>
                            <div className="more-top-edge"></div>
                        </Link>
                }
            </div>
        )
    };

    correctScrollPosition = (ref) => {
        var prevItem = this.lastItems.length > 0 ? this.lastItems[this.lastItems.length - 1] : null;

        //если наш новый открываемый элемент ниже, чем открытый - то корректируем
        if (prevItem && ref.offsetTop > prevItem.element.offsetTop) {
            document.body.scrollTop = this.beforeExpandBodyScrollTop - prevItem.correctScrollTop;
        }

        this.beforeExpandOffsetTop = null;
    };

    handleGotoNext = (e) => {
        e.preventDefault();
        e.stopPropagation();

        //получаем сам item
        var element;
        if (this.props.withCategories) {
            element = e.target.closest('.category-item');
        }
        else {
            element = e.target.closest('.item');
        }

        if (element) {
            var screenHeight = htmlHelper.getScreenSize().y;
            document.body.scrollTop = element.offsetTop + element.offsetHeight - screenHeight / 3;
        }
    };

    /**
     * @param e
     * @param {ItemModel} item
     * @param ix
     */
    handleItemClick = (e, item, ix) => {
        if (e.target.nodeName == 'A') {
            //пусть срабатывает ссылка
            // if (e.target.hasAttribute('target')) {
            //     e.target.removeAttribute('target');
            // }
            e.target.setAttribute('target', '_blank');

            trackEvent('item opened', item.sourceName, item.link);
        }
        else {
            //если не ссылка - то наш обработчик
            e.preventDefault();

            //получаем сам item
            var el;
            if (this.props.withCategories) {
                el = e.target.closest('.category-item');
            }
            else {
                el = e.target.closest('.item');
            }

            //вставляем в начало
            this.lastItems.unshift({
                element: el,
                height: el.offsetHeight
                // expandedHeight: //задаем ее в след. клике
            });
            //отрубаем конец
            if (this.lastItems.length > 2) {
                this.lastItems.length = 2;
            }

            //вычисляем развернутую высоту предыдущего
            var prevItem = this.lastItems[this.lastItems.length - 1];
            if (prevItem) {
                prevItem.expandedHeight = prevItem.element.offsetHeight;
                prevItem.correctScrollTop = prevItem.expandedHeight - prevItem.height;
            }

            // //сохраняем позицию скрола до раскрытия след. элемента
            this.beforeExpandOffsetTop = el.offsetTop;
            this.beforeExpandBodyScrollTop = document.body.scrollTop;


            var itemId = getLinkKey(item.link, item.guid);
            if (this.props.openItemId == itemId) {
            }
            else {
                trackEvent('item expanded', item.sourceName, item.link);
                this.props.setOpenItem(itemId);
            }
        }
    }
}


class ItemsListProps {
    /** @type {ItemModel[]|CategoryWithItemsModel[]} */
    items;
    /** @type {boolean} */
    itemsLoading;
    /** @type {number} */
    openItemId;
    /** @type {boolean} */
    hasMore;

    /** @type {function} */
    moreLinkTo = () => {
    };
    /** @type {boolean} */
    hideMoreLink;

    /** @type {function} */
    setOpenItem = (itemId) => {
    };

    /** @type {function} */
    loadMore = () => {
    };

    /** @type {boolean} */
    withCategories;
}