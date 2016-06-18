import React from 'react'
import { Router, Route, Link } from 'react-router'
import LoginController from './../utils/LoginController';

export default class Menu extends React.Component{
    
    constructor(props){
        super(props);
        this.Logout = this.Logout.bind(this);
        
        this.state = {
            menuItems: [
                // {
                //     Id: 1,
                //     Name: "Rezervat",
                //     Url: "/"
                // },
                {
                    Id: 2,
                    Name: "Fushate",
                    Url: "/campaigns"
                },
                {
                    Id: 3,
                    Name: "Dhurues",
                    Url: "/donators"
                }
            ]
        };
    
    }
    
    Logout(){
        LoginController.Logout();
    }
    
    
    render(){
        var items = this.state.menuItems.map(function(item) {
            return (
                <Link 
                    className="blog-nav-item" 
                    key={item.Id} 
                    to={item.Url}
                >{item.Name}</Link>
            );
        });
        
        if(this.props.loggedIn) items.push(<a onClick={this.Logout}>Logout</a>);
        
        return(
            <nav className="head-right main-menu blog-nav">
                {items}
            </nav>
        );
    }
}
