/**
 * Created by Alexander on 22.12.2016.
 */
import * as types from '../constants/ActionTypes';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

class CommonState {
    /** @type {string} */
    title = 'Tap News';
}

const initialState = new CommonState();

export default function (state = initialState, action = null) {
    /** @type {CommonState} */
    let newState = Object.assign({}, state);

    switch (action.type) {
        case types.COMMON_SET_TITLE:
            newState.title = action.payload;

            if (canUseDOM) {
                document.title = newState.title;
            }

            return newState;

        default:
            return state;
    }
}