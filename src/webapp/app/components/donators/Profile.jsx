import React from 'react';
import {Endpoints} from './../../configs/Url';


export default class Profile extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            edit: false,
            buttonText: "Ndrysho"
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
                            <span>{this.props.data.name}</span> {this.props.data.surname}
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
        
        if(this.state.edit == true) display = (
            <div className="ProfileEdit">
                <ul>
                    <li>
                        <label>
                            <span>Emri</span>
                            <input name="name" value={this.props.data.name} type="text" />
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>Mbiemri</span>
                            <input name="surname" value={this.props.data.surname} type="text" />
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>Grup Gjaku</span>
                            <input name="bloodtype" value={this.props.data.blood_type} type="text" />
                        </label>
                    </li>
                </ul>
            </div>
        );
        
        return (
            <div>
                {display}
                <button onClick={this.onClick.bind(this)}>{this.state.buttonText}</button>
            </div>
        )
    }
}
