import React from 'react';
import Header from './components/Header';
import { Router } from 'react-router';
import LoginController from './utils/LoginController';
import Login from './components/Login';

export default class App extends React.Component {
    
    constructor(props){
        super(props);
        this.updateAuth = this.updateAuth.bind(this);
        
        this.state = {
            loggedIn: LoginController.LoggedIn()
        }
    }   
    
    updateAuth(loggedIn){
        this.setState({
            loggedIn: loggedIn
        });
    }
    
    componentWillMount(){
        LoginController.onChange = this.updateAuth;
    }
    
    render() {
        return (
            <div>
                <Header loggedIn={this.state.loggedIn} />
                {this.state.loggedIn ? (
                    <div className="container">
                        {this.props.children}
                    </div>
                ) : (
                    <div>
                        <Login />
                    </div>
                )}
            </div>
        );
    }
}