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
        var items = state.sourcePage.items;

        var sourceId = params.id;
        var lastPubDate = nextPage ? nextPage.pubDate : null;
        var lastId = nextPage ? nextPage._id : null;

        var needToLoadData = false;
        if (items.length == 0 || items[0].sourceId != sourceId) {
            needToLoadData = true;
            dispatch({
                type: types.SOURCE_PAGE_CLEAR_DATA
            });
        }
        else if (lastPubDate || lastId) {
            needToLoadData = true;
        }

        if (needToLoadData) {
            dispatch({
                type: types.SOURCE_PAGE_DATA_LOADING,
                payload: true,
            });

            return new Promise((resolve, reject) => {
                var initialDataUrl = `/items/list/bySourceId/paged/${sourceId}`;
                var loadMoreDataUrl = `/items/list/bySourceId/paged/${sourceId}/${lastPubDate}/${lastId}`;
                var url = lastPubDate && lastId ? loadMoreDataUrl : initialDataUrl;

                apiClient.get(url)
                    .then((data) => {
                        dispatch({
                            type: types.SOURCE_PAGE_GET_DATA,
                            payload: data,
                        });

                        var sourceName = htmlHelper.getTitle(data && data.items.length > 0 ? data.items[0].sourceName : null);
                        dispatch({
                            type: types.COMMON_SET_TITLE,
                            payload: sourceName
                        });

                        resolve();
                    })
                    .catch(() => {
                        dispatch({
                            type: types.SOURCE_PAGE_DATA_LOADING,
                            payload: false,
                        });

                        reject();
                    });
            });
        }
        else {
            var items = state.sourcePage.items;
            var sourceName = htmlHelper.getTitle(items && items.length > 0 ? items[0].sourceName : null);
            dispatch({
                type: types.COMMON_SET_TITLE,
                payload: sourceName
            });

            return Promise.resolve();
        }
    };
}

export function setOpenItemId(openItemId) {
    return {
        type: types.SOURCE_PAGE_CHANGE_OPEN_ITEM_ID,
        payload: openItemId,
    }
}