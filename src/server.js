/**
 * Created by Alexander Sveshnikov on 21/11/16.
 */

import express from 'express';
import path from 'path';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import React from 'react';
import {renderToString} from 'react-dom/server';

import {match, RouterContext} from 'react-router';

import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createStore, compose, applyMiddleware} from 'redux';
import rootReducer from './reducers';
import {fetchComponentData} from './common/fetchComponentData';

import routes from './routes';
import proxy from './proxy';
import redirect from './redirect';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';

var app = express();

const NODE_ENV = (process.env.NODE_ENV || 'development').trim().toLowerCase();
var isDevelopment = NODE_ENV != 'production';
var isProductionMode = NODE_ENV == 'production';

if (isDevelopment) {
    var webpackConfig = require('../webpack.config');
    console.log('development: using webpackDevMiddleware');

    //патчим путь для дев сервера
    webpackConfig.output.filename = "bundle.js";
    app.use(webpackDevMiddleware(webpack(webpackConfig), {
        publicPath: '/assets/',
        stats: {
            colors: true,
            chunks: false,
            hash: false,
            version: false,
            // publicPath: true,
        },
        // noInfo: true
    }));
}

app.use(compression());

var publicPath = path.join(__dirname, '../public');
var buildPath = path.join(__dirname, '../build');

// console.log('publicPath', publicPath);
// console.log('buildPath', buildPath);

app.use(express.static(publicPath));
app.use(express.static(buildPath));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(proxy);
app.use(redirect);

// send all requests to index.html so browserHistory works
app.get('*', (req, res) => {
    match({routes: routes, location: req.url}, (err, redirect, props) => {
        // in here we can make some decisions all at once
        if (err) {
            // there was an error somewhere during route matching
            addNoCacheHeaders(res);
            res.status(500).send(err.message);
        } else if (redirect) {
            // we haven't talked about `onEnter` hooks on routes, but before a
            // route is entered, it can redirect. Here we handle on the server.
            res.redirect(redirect.pathname + redirect.search);
        } else if (props) {

            // Compile an initial state
            let initialState = {};
            // Create a new Redux store instance
            // const store = createStore(rootReducer, initialState);
            const middlewares = [thunk];
            const store = createStore(rootReducer, initialState, compose(applyMiddleware(...middlewares)));
            // console.log('initialState', store.getState());

            //This method waits for all render component promises to resolve before returning to browser
            fetchComponentData(store.dispatch, props.components, props.params)
                .then(() => {
                    // then we matched a route and can render
                    const html = renderToString(
                        <Provider store={store}>
                            <RouterContext {...props}/>
                        </Provider>
                    );

                    // Grab the initial state from our Redux store
                    const finalState = store.getState();
                    // console.log('finalState', finalState);

                    const isNotFound = props.components.find((comp) => comp.name == 'PageNotFound');
                    if (isNotFound) {
                        res.status(404).send(renderPage(html, finalState, req.url));
                    }
                    else {
                        addNoCacheHeaders(res);
                        res.send(renderPage(html, finalState, req.url));
                    }
                })
                .catch(err => {
                    addNoCacheHeaders(res);
                    res.status(500).send(err.message);
                });
        } else {
            // no errors, no redirect, we just didn't match anything
            res.status(404).send('Not Found');
        }
    })
});

function addNoCacheHeaders(response) {
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    response.setHeader("Expires", "0"); // Proxies.
}

/**
 * @param html
 * @param {RootState} finalState
 * @returns {string}
 */
function renderPage(html, finalState, url) {
    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="/favicons/manifest.json">
    <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5">
    <link rel="shortcut icon" href="/favicons/favicon.ico">
    <meta name="msapplication-config" content="/favicons/browserconfig.xml">
    <meta name="theme-color" content="#ffffff">
    
    <meta name="keywords" content="новости сми">
    <meta name="Description" content="Главные новости в удобном и быстром интерфейсе.">
    <title>${finalState.common.title}</title>
    
    <meta property="og:title" content="${finalState.common.title}" >
    <meta property="og:url" content="https://tapnews.ru${url}" />
    <meta property="og:site_name" content="TapNews" />
    <meta property="og:description" content="Главные новости в удобном и быстром интерфейсе." />
    
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,700" rel="stylesheet">
    ${isProductionMode ? '<link rel="stylesheet" href="/assets/main.css"/>' : ''}
    <link rel="stylesheet" href="/fontello-143596ff/css/fontello-embedded.css"/>
   
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
</script>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-89215438-1', 'auto');
  ga('send', 'pageview');
</script>

</head>
<body>
<div id=app>${html}</div>
<div style="display:none;">
<script>
  window.__PRELOADED_STATE__ = ${JSON.stringify(finalState)};
</script>
</div>
<script src="/assets/bundle.js"></script>

</body>
</html>`
}

var PORT = process.env.PORT || 8123;
app.listen(PORT, function () {
    console.log('Server running at localhost:' + PORT, 'isProductionMode', isProductionMode)
});