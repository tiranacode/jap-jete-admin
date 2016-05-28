import React from 'react';
import Menu from './Menu';
import LoginController from './../utils/LoginController';

export default class Header extends React.Component{
    
    constructor(props){
        super(props);
        
        this.Logout = this.Logout.bind(this);
        
    }
        
    Logout(){
        LoginController.Logout();
    }
    
    render(){
        return(
            <div className="head">
                <div className="head-container">
                    <div className="head-left">
                        <a className="navbar-brand" href="#">
                            <img src="webapp/static/images/logo_64.png" />
                        </a>
                        {this.props.loggedIn ? (
                            <a onClick={this.Logout}>Logout</a>
                        ) : (<a />)}
                    </div>
                    
                    {this.props.loggedIn ? (
                    <Menu />) : (<span></span>)}
                </div>
            </div>
        );
    }
}
