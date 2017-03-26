/**
 * Created by Alexander on 22.12.2016.
 */
import * as types from "../constants/ActionTypes";

export function setTitle(title) {
    return {
        type: types.COMMON_SET_TITLE,
        payload: title
    };
}