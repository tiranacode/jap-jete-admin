import React from 'react';
import Menu from './Menu'

export default class Header extends React.Component{
    
    constructor(props){
        super(props);
    }
    
    
    render(){
        return(
            <div className="head">
                <div className="head-container">
                    <div className="head-left">
                        <a href="#">
                            <img src="webapp/static/images/logo_64.png" />
                        </a>
                    </div>
                    <Menu />
                </div>
            </div>
        );
    }
}
