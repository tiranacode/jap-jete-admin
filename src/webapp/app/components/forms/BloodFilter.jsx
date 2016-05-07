import React from 'react';
import Constants from './../../configs/Constants'

export default class BloodFilter extends React.Component{
    
    constructor(props){
        super(props);
    }
    
    render(){
        
        //group the filters
        var filters = [];
        for(var i=0; i<Constants.BloodTypes.length; i+=2){
            var group = [];
            group.push( <BloodType key={i} blood={Constants.BloodTypes[i]} />);
            group.push( <BloodType key={i+1} blood={Constants.BloodTypes[i+1]} />);
            
            filters.push(
                <div className="bloodGroup" key={i}>{group}</div>
            );
        }
        
        return (
            <div className="bloodFilter form-group">
                <div className="bloodFilter-left">
                    {filters}
                </div>
                <div className="bloodFilter-right">
                    <BloodType blood="Te Gjitha" />
                </div>
            </div>
        );
    }
}

class BloodType extends React.Component{
    
    render(){
        return(
            <span key={this.props.blood} className="bloodType">
                <label>
                    <input type="checkbox" name="bloodFilter" className="form-control"
                     value={this.props.blood} />
                    {this.props.blood}
                </label>
            </span>
        );
    }
}