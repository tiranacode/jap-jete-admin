import React from 'react';
import CommonUtils from './../../utils/Commons.js';
import Rest from './../../utils/Rest.js';
import {Endpoints} from './../../configs/Url.js';
import LoginController from './../../utils/LoginController';

export default class Campaign extends React.Component{
    
    constructor(params){
        super(params);
        this.onClick = this.onClick.bind(this);
        this.endCampaign = this.endCampaign.bind(this);
    }
    
    onClick(){
        //TODO: open campaign for edit
        this.props.onEdit(this.props.data);
    }
    
    endCampaign(){
        //TODO: end campaign
        var conf = confirm("Jeni te sigurt?");
        if(conf == false) return;
        
        var data = LoginController.GetSessionAsParams(), func = Rest.delete;
        var endpoint = Endpoints.DeactivateCampaign;
        
        if(!this.props.data.active){
            endpoint = Endpoints.ActivateCampaign;
            func = Rest.readJSON;
        }
        endpoint = endpoint.replace("{0}",this.props.data.id);
            
        func(endpoint + data, data,
            (res) => {
                if(res.status == "ok"){
                    //force state refresh
                    this.props.data.active = !this.props.data.active;
                    this.setState({ });
                }
            },
            (error) => {
                console.error(error);
            }
        );
    }
    
    render(){
        
        var text = "Mbyll";
        if(!this.props.data.active)
            text = "Fillo";
        
        return(
            <div className="campaignElement" key={this.props.data.id}>
                <div>
                    <a onClick={this.onClick}>
                        <span>{this.props.data.title}</span>
                        <span className="campaignBloods">  -  {this.props.data.bloodTypes.toString()}</span>
                    </a>
                    <span className="right">
                        <button 
                            onClick={this.endCampaign} 
                            className="btn"
                        >{text}</button>
                    </span>
                
                </div>
                <span>{CommonUtils.getFormattedDate(this.props.data.startDate)}</span>
            </div>
        )
    }
    
}




