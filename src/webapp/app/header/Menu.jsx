import React from 'react'

export default class Menu extends React.Component{
    
    constructor(props){
        super(props);
        
        
        this.state = {
            menuItems: [
                {
                    Id: 1,
                    Name: "Rezervat",
                    Url: "#"
                },
                {
                    Id: 2,
                    Name: "Fushate",
                    Url: "#"
                },
                {
                    Id: 3,
                    Name: "Dhurues",
                    Url: "#"
                }
            ]
        };
    
    }
    
    render(){
        var items = this.state.menuItems.map(function(item) {
            return (
                <a key={item.Id} href={item.Url}>
                    {item.Name}
                </a>
            );
        });
        return(
            <nav className="head-right main-menu">
                {items}
            </nav>
        );
    }
}
