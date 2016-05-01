import React from 'react';
import {Endpoints} from './../../configs/Url' 

export default class Profile extends React.Component{
    
    constructor(props){
        super(props);
    }
    
    onClick(){
        
    }
    
    render(){
        var img = Endpoints.FacebookPicture.replace("{0}", this.props.data.user_id);
        
        
        return (
            <div>
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
                <div className="ProfileEdit">
                    <button onClick={this.onClick}>Ndrysho</button>
                </div>
            </div>
        )
    }
}