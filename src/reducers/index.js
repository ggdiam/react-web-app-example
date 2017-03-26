import {combineReducers} from 'redux';
import common from './common';
import homePage from './homePage';
import categoryPage from './categoryPage';
import sourcePage from './sourcePage';

class RootState {
    /** @type {CommonState  } */
    common = common;
    /** @type {HomePageState} */
    homePage = homePage;
    /** @type {CategoryPageState} */
    categoryPage = categoryPage;
    /** @type {SourcePageState} */
    sourcePage = sourcePage;
}

const rootReducer = combineReducers(new RootState());

// const rootReducer = combineReducers({
//     homePage,
// });

export default rootReducer
