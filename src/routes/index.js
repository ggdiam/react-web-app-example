/**
 * Created by Alexander Sveshnikov on 21/11/16.
 */
import React from 'react'
import {Router, Route, Redirect, IndexRoute, Link, browserHistory, useRouterHistory, IndexRedirect} from 'react-router';

import App from '../components/App/App';
import PageHome from '../components/PageHome/PageHome';
import PageCategory from '../components/PageCategory/PageCategory';
import PageSource from '../components/PageSource/PageSource';
import PageAbout from '../components/PageAbout/PageAbout';
import PageNotFound from '../components/PageNotFound/PageNotFound';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={PageHome}/>
        <Route path="category/:id" component={PageCategory}/>
        <Route path="source/:id" component={PageSource}/>
        <Route path="about(/:id)" component={PageAbout}/>
        <Route path="*" component={PageNotFound}/>
    </Route>
)
