import React from 'react';
import Menu from './Menu';

export default class Header extends React.Component{
    
    constructor(props){
        super(props);
               
    }
        
    render(){
        return(
            <div className="navbar navbar-default navbar-inverse" role="navigation">
                <div className="container">
                    <a className="navbar-brand" href="#">
                        <img src="webapp/static/images/logo_64.png"/>
                    </a>
                    {this.props.loggedIn ? (
                    <Menu loggedIn={this.props.loggedIn}/>) : (<span></span>)}
                </div>
            </div>
        );
    }
}
