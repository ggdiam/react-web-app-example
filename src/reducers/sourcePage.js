/**
 * Created by Alexander Sveshnikov on 29.11.16.
 */
import * as types from '../constants/ActionTypes';

class SourcePageState {
    /** @type {ItemModel[]} */
    items = [];
    /** @type {NextPrevModel} */
    prevPage = null;
    /** @type {NextPrevModel} */
    nextPage = null;
    /** @type {boolean} */
    itemsLoading;
    /** @type {number} */
    openItemId = NaN;
    // /** @type {number[]} */
    // openItemIds = [];
}

const initialState = new SourcePageState();

export default function (state = initialState, action = null) {
    /** @type {SourcePageState} */
    let newState = Object.assign({}, state);

    switch (action.type) {
        case types.SOURCE_PAGE_GET_DATA:
            newState.items = [...state.items, ...action.payload.items];
            newState.nextPage = action.payload.nextPage;
            newState.itemsLoading = false;
            return newState;

        case types.SOURCE_PAGE_CLEAR_DATA:
            newState.items = [];
            newState.nextPage = null;
            return newState;

        case types.SOURCE_PAGE_DATA_LOADING:
            newState.itemsLoading = action.payload;
            return newState;

        case types.SOURCE_PAGE_CHANGE_OPEN_ITEM_ID:
            newState.openItemId = action.payload;
            return newState;

        default:
            return state;
    }
}