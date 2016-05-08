import React from 'react';
import BloodType from './BloodType';
import Constants from './../../configs/Constants'

export default class BloodFilter extends React.Component{
    
    constructor(props){
        super(props);
        this.bloodUpdate = this.bloodUpdate.bind(this);
        this.bloodUpdateAll = this.bloodUpdateAll.bind(this);
        this.state = {
            bloodTypes: [] //selected blood types
        }
    }
    
    bloodUpdate(selected, blood){
        var ind = this.state.bloodTypes.indexOf(blood);
        var bloodTypes = this.state.bloodTypes;
        if(ind >= 0) bloodTypes.splice(ind,1);
        else bloodTypes.push(blood);
        
        this.setState({
            bloodTypes: bloodTypes
        });
        
        //send bloodTypes to parent
        if(this.props.onUpdate)
            this.props.onUpdate(this.state.bloodTypes);
    }
    
    bloodUpdateAll(selected){
        //TODO
    }
         
    componentWillReceiveProps(nextProps){
        if(nextProps.bloodTypes)
            this.setState({
                bloodTypes: nextProps.bloodTypes
            });
    }
    
    render(){
        //group the filters
        var filters = [];
        for(var i=0; i<Constants.BloodTypes.length; i+=2){
            var group = [];
            var selected = false;
            if(this.state.bloodTypes.indexOf(Constants.BloodTypes[i]) > -1)
                selected = true;
            group.push( 
                <BloodType 
                    key={i} 
                    onUpdate={this.bloodUpdate} 
                    blood={Constants.BloodTypes[i]} 
                    selected={selected}
            />);
            
            selected = false;
            if(this.state.bloodTypes.indexOf(Constants.BloodTypes[i+1]) > -1)
                selected = true;
            
            group.push( 
                <BloodType 
                    key={i+1} 
                    onUpdate={this.bloodUpdate} 
                    blood={Constants.BloodTypes[i+1]}
                    selected={selected}
            />);
            
            filters.push(
                <div className="bloodGroup" 
                    key={i}
                >{group}</div>
            );
        }
        
        return (
            <div className="bloodFilter form-group">
                <div className="bloodFilter-left">
                    {filters}
                </div>
                <div className="bloodFilter-right">
                    <BloodType 
                        blood="Te gjithe" 
                        onUpdate={this.bloodUpdateAll} 
                        selected={false}
                    />
                </div>
            </div>
        );
    }
}
