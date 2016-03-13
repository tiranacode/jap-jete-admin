import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import App from './app/App';
import Donators from './app/components/Donators'

//Render routes
ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path="donators" component={Donators}/>
        </Route>
    </Router>
    
), document.getElementById("app"));



