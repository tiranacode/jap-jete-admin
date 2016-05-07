import React from 'react'
import { Router, Route, Link } from 'react-router'

export default class Menu extends React.Component{
    
    constructor(props){
        super(props);
        
        
        this.state = {
            menuItems: [
                {
                    Id: 1,
                    Name: "Rezervat",
                    Url: "/"
                },
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
    
    render(){
        var items = this.state.menuItems.map(function(item) {
            return (
                <Link className="blog-nav-item" key={item.Id} to={item.Url}>{item.Name}</Link>
            );
        });
        return(
            <nav className="head-right main-menu blog-nav">
                {items}
            </nav>
        );
    }
}
