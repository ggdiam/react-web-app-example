/**
 * Created by Alexander Sveshnikov on 02.12.16.
 */
import React from "react";
import * as helper from "../../helpers/htmlHelper";

class InfiniteListProps {
    /** @type {string} */
    id = "";
    /** @type {?XML[]} */
    children = null;
    /** @type {string} */
    className = "";
    /** @type {number} */
    offset = 0;
    /** @type {boolean} */
    hasMore = false;
    /** @type {function} */
    loadMore = () => {
    };
    /** @type {boolean} */
    loadingMore = false;
}

export default class InfiniteList extends React.Component {
    /** @type {InfiniteListProps} */
    props;

    /** @type {?HTMLElement} */
    infiniteListDOM;

    static propTypes = {
        children: React.PropTypes.array,
        className: React.PropTypes.string,
        offset: React.PropTypes.number,
        hasMore: React.PropTypes.bool,
        loadMore: React.PropTypes.func,
        loadingMore: React.PropTypes.bool,
    };

    static defaultProps = new InfiniteListProps();

    constructor(props) {
        super(props);
    }

    onScroll = () => {
        if (!this.props.hasMore) {
            return;
        }
        if (this.props.loadingMore) {
            return;
        }

        let overflowParent = helper.getOverflowParent(this.infiniteListDOM);
        let {scrollTop, clientHeight, scrollHeight} = overflowParent;
        let viewed = scrollTop + clientHeight + this.props.offset;
        if (viewed >= scrollHeight) {
            this.props.loadMore();
        }
    };

    componentDidUpdate() {
        this.onScroll();
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll, true);
        window.addEventListener("resize", this.onScroll, true);
        this.onScroll();
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll, true);
        window.removeEventListener("resize", this.onScroll, true);
    }

    render() {
        return (
            <div id={this.props.id} className={this.props.className} ref={(ref) => {
                this.infiniteListDOM = ref;
            }}>
                {this.props.children}
                <div style={{display: this.props.loadingMore ? "block" : "none"}}>
                </div>
            </div>
        );
    }
}
