/**
 * Created by Alexander Sveshnikov on 29.11.16.
 */
import * as types from "../constants/ActionTypes";
import apiClient from '../core/apiClient';
import * as htmlHelper from '../helpers/htmlHelper';

export function getPageData(params, nextPage) {
    return (dispatch, getState) => {

        /** @type {RootState} */
        var state = getState();
        var items = state.categoryPage.items;

        var categoryId = params.id;
        var lastPubDate = nextPage ? nextPage.pubDate : null;
        var lastId = nextPage ? nextPage._id : null;

        var needToLoadData = false;
        if (items.length == 0 || items[0].catUid != categoryId) {
            needToLoadData = true;
            dispatch({
                type: types.CATEGORY_PAGE_CLEAR_DATA
            });
        }
        else if (lastPubDate || lastId) {
            needToLoadData = true;
        }

        if (needToLoadData) {
            dispatch({
                type: types.CATEGORY_PAGE_DATA_LOADING,
                payload: true,
            });

            return new Promise((resolve, reject) => {
                var initialDataUrl = `/items/list/byCategoryId/paged/${categoryId}`;
                var loadMoreDataUrl = `/items/list/byCategoryId/paged/${categoryId}/${lastPubDate}/${lastId}`;
                var url = lastPubDate && lastId ? loadMoreDataUrl : initialDataUrl;

                apiClient.get(url)
                    .then((data) => {
                        dispatch({
                            type: types.CATEGORY_PAGE_GET_DATA,
                            payload: data,
                        });

                        var categoryName = htmlHelper.getTitle(data && data.items.length > 0 ? data.items[0].catName : null);
                        dispatch({
                            type: types.COMMON_SET_TITLE,
                            payload: categoryName
                        });

                        resolve();
                    })
                    .catch(() => {
                        dispatch({
                            type: types.CATEGORY_PAGE_DATA_LOADING,
                            payload: false,
                        });

                        reject();
                    });
            });
        }
        else {
            var items = state.categoryPage.items;

            var categoryName = htmlHelper.getTitle(items && items.length > 0 ? items[0].catName : null);
            dispatch({
                type: types.COMMON_SET_TITLE,
                payload: categoryName
            });

            return Promise.resolve();
        }
    };
}

export function setOpenItemId(openItemId) {
    return {
        type: types.CATEGORY_PAGE_CHANGE_OPEN_ITEM_ID,
        payload: openItemId,
    }
}