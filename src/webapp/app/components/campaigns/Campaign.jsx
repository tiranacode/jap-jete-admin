import React from 'react';
import CommonUtils from './../../utils/Commons.js';

export default class Campaign extends React.Component{
    
    constructor(params){
        super(params);
        this.onClick = this.onClick.bind(this);
        this.endCampaign = this.endCampaign.bind(this);
        this.state = {
            buttonText: "Mbyll"
        }
    }
    
    componentDidMount(){
        var text = "Mbyll";
        if(!this.props.data.active)
            text = "Fillo";
        this.setState({
            buttonText: text
        });
    }
    
    onClick(){
        //TODO: open campaign for edit
        this.props.onEdit(this.props.data);
    }
    
    endCampaign(){
        //TODO: end campaign
    }
    
    render(){
        
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
                        >{this.state.buttonText}</button>
                    </span>
                
                </div>
                <span>{CommonUtils.getFormattedDate(this.props.data.startDate)}</span>
            </div>
        )
    }
    
}




