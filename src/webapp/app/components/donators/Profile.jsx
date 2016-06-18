import React from 'react';
import {Endpoints} from './../../configs/Url';
import Constants from './../../configs/Constants';


export default class Profile extends React.Component{
    
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
        this.updateFirstName = this.updateFirstName.bind(this);
        this.updateLastName = this.updateLastName.bind(this);
        this.updateBloodType = this.updateBloodType.bind(this);
        
        this.state = {
            edit: false,
            buttonText: "Ndrysho",
            first_name: '',
            last_name: '',
            blood_type: ''
        }
    }
    
    onClick(){
        if(this.state.edit == false)
            this.setState({
                edit: true,
                buttonText: "Ruaj"
            });
        else this.setState({
                edit: false,
                buttonText: "Ndrysho"
            });
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            first_name: nextProps.data.first_name,
            last_name: nextProps.data.last_name,
            blood_type: nextProps.data.blood_type
        });
    }
    
    updateFirstName(event){
        this.setState({
            first_name: event.target.value
        });
    }
    
    updateLastName(event){
        this.setState({
            last_name: event.target.value
        });
    }
    
    updateBloodType(event){
        this.setState({
            blood_type: event.target.value
        });
    }
    
    render(){
        var img = Endpoints.FacebookPicture.replace("{0}", this.props.data.user_id);
        
        var display = (
            <div className="Profile">
                <div className="ProfileDiv">
                    <img src={img} />
                </div>
                <div className="ProfileDiv">
                    <ul>
                        <li>
                            <span>{this.props.data.first_name}</span> {this.props.data.last_name}
                        </li>
                        <li>
                            <span>ID:</span> {this.props.data.user_id}
                        </li>
                        <li>
                            <span>Grup Gjaku:</span> {this.props.data.blood_type}
                        </li>
                    </ul>
                </div>
            </div>
        );
        
        var bloodTypes = Constants.BloodTypes.map( (val)=>{
            return(
                <option>
                    {val}
                </option>
            );
        } );
        
        if(this.state.edit == true) display = (
            <div className="ProfileEdit form-data">
                <ul>
                    <li>
                        <label>
                            <span>Emri</span>
                            <input 
                                name="name" 
                                className="form-control" 
                                value={this.state.first_name} 
                                type="text" 
                                onChange={this.updateFirstName}
                            />
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>Mbiemri</span>
                            <input 
                                name="surname" 
                                className="form-control" 
                                value={this.state.last_name} 
                                type="text" 
                                onChange={this.updateLastName}
                            />
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>Grup Gjaku</span>
                            
                            <select
                                name="bloodtype"
                                className="form-control" 
                                onChange={this.updateBloodType}
                            >
                                {bloodTypes}
                            </select>
                        </label>
                    </li>
                </ul>
            </div>
        );
        
        return (
            <div>
                {display}
                <button 
                    className="btn" 
                    onClick={this.onClick}
                >{this.state.buttonText}
                </button>
            </div>
        )
    }
}
