/**
 * Created by Alexander Sveshnikov on 21/11/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import {Router, browserHistory} from 'react-router';
import {match} from 'react-router';

import routes from './routes';

// Grab the state from a global injected into server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;

const store = configureStore(preloadedState);

//скролим наверх
setTimeout(() => {
    document.body.scrollTop = 0;
}, 0);


var history = browserHistory;

history.listen(function (location) {
    window.ga('send', 'pageview', location.pathname);
});

match({ history: history, routes}, (error, redirectLocation, renderProps) => {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={history} {...renderProps} />
        </Provider>,
        document.getElementById('app')
    )
});


(function() {
    var timestamp = new Date().getTime();

    function checkResume() {
        var current = new Date().getTime();
        if (current - timestamp > 20000) {
            var event = document.createEvent("Events");
            event.initEvent("resume", true, true);
            document.dispatchEvent(event);
        }
        timestamp = current;
    }

    //каждые 10 секунд делаем проверку, что приложение было свернуто
    //если пройдет более 20 секунд - то тригернется событие resume
    window.setInterval(checkResume, 10000);
})();


//полифилы
(function(ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
            if (!this) return null;
            if (this.matches(selector)) return this;
            if (!this.parentElement) {return null}
            else return this.parentElement.closest(selector)
        };
}(Element.prototype));
