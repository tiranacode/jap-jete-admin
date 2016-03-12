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
                            <img src="#" />
                        </a>
                    </div>
                    <Menu />
                </div>
            </div>
        );
    }
}