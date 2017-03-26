/**
 * Created by Alexander Sveshnikov on 23/11/16.
 */
import * as types from "../constants/ActionTypes";
import apiClient from '../core/apiClient';
import * as htmlHelper from '../helpers/htmlHelper';

export function getPageData(params) {
    return (dispatch, getState) => {

        /** @type {RootState} */
        var state = getState();
        var items = state.homePage.items;

        // dispatch({
        //     type: types.COMMON_SET_TITLE,
        //     payload: htmlHelper.getTitle()
        // });

        return new Promise((resolve, reject) => {
            dispatch({
                type: types.HOME_PAGE_DATA_LOADING,
                payload: true
            });

            var url = '/items/list';

            apiClient.get(url)
                .then((data) => {
                    dispatch({
                        type: types.HOME_PAGE_GET_DATA,
                        payload: data,
                    });

                    resolve();
                })
                .catch(() => {
                    dispatch({
                        type: types.HOME_PAGE_DATA_LOADING,
                        payload: false
                    });

                    reject();
                });
        });
    };
}

export function getNextPageData() {
    return {
        type: types.HOME_PAGE_GET_NEXT_DATA
    }
}

export function setOpenItemId(openItemId) {
    return {
        type: types.HOME_PAGE_CHANGE_OPEN_ITEM_ID,
        payload: openItemId,
    }
}