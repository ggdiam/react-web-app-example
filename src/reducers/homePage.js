import * as types from '../constants/ActionTypes';

class HomePageState {
    /** @type {number} */
    timestamp = 0;
    /** @type {CategoryWithItemsModel[]} */
    items = [];
    /** @type {CategoryWithItemsModel[]} */
    allItems = [];
    /** @type {boolean} */
    hasMore;
    /** @type {boolean} */
    itemsLoading;
    /** @type {number} */
    openItemId = NaN;
}

const initialState = new HomePageState();

export default function (state = initialState, action = null) {
    /** @type {HomePageState} */
    let newState = Object.assign({}, state);

    switch (action.type) {
        case types.HOME_PAGE_GET_DATA:
            newState.timestamp = +(new Date());
            newState.allItems = action.payload;
            newState.items = newState.allItems.slice(0, 5);
            newState.hasMore = newState.allItems.length > newState.items.length;
            newState.itemsLoading = false;
            return newState;

        case types.HOME_PAGE_GET_NEXT_DATA:
            newState.items = [...state.items, ...state.allItems.slice(state.items.length, state.items.length + 5)];
            newState.hasMore = state.allItems.length > newState.items.length;
            return newState;

        case types.HOME_PAGE_CLEAR_DATA:
            newState.items = [];
            newState.hasMore = false;
            return newState;

        case types.HOME_PAGE_DATA_LOADING:
            newState.itemsLoading = action.payload;
            return newState;

        case types.HOME_PAGE_CHANGE_OPEN_ITEM_ID:
            newState.openItemId = action.payload;
            return newState;

        default:
            return state;
    }
}