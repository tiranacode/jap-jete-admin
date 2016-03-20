import React from 'react';
import Constants from './../../configs/Constants'

export default class BloodFilter extends React.Component{
    
    constructor(props){
        super(props);
        this.filters = [];
        
        for(var i=0; i<Constants.BloodTypes.length; i++)
            this.filters.push(
                <span key={i}>
                    <input type="checkbox" id={"filter_" + i} name="bloodFilter" value={Constants.BloodTypes[i]} />
                    <label htmlFor={"filter_" + i}>{Constants.BloodTypes[i]}</label>
                </span>
            );
    }
    
    render(){
        return (
            <div className="bloodFilter">
                {this.filters}
            </div>
        );
    }
}