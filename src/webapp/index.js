import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, browserHistory } from 'react-router';
import App from './app/App';
import Donators from './app/components/Donators'
import Campaigns from './app/components/Campaigns'
import Login from './app/components/Login'

import LoginController from './app/utils/LoginController';



function requireAuth(nextState, replace) {
    if (!LoginController.LoggedIn()) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        });
    }
}

//Render routes
ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="login" component={Login}/>
            <Route path="donators" component={Donators} onEnter={requireAuth}/>
            <Route path="campaigns" component={Campaigns} onEnter={requireAuth}/>
        </Route>
    </Router>
    
), document.getElementById("app"));
