import React from 'react';

export default class BloodType extends React.Component{
    
    constructor(props){
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            selected: false
        }
    }
    
    onChange(){
        var newVal = !this.state.selected;
        
        this.setState({
            selected: newVal
        });
        this.props.onUpdate(newVal, this.props.blood);
        console.log(newVal);
    }
    
    render(){
        return(
            <span key={this.props.blood} className="bloodType">
                <label>
                    <input 
                        type="checkbox" 
                        name="bloodFilter" 
                        className="form-control"
                        value={this.props.blood} 
                        onChange={this.onChange}
                        selected={this.state.selected}
                    />
                    {this.props.blood}
                </label>
            </span>
        );
    }
}