import React from 'react';
import Campaign from './Campaign';

export default class CampaignsList extends React.Component{
    
    constructor(params){
        super(params);
        this.campaignEdit = this.campaignEdit.bind(this);
    }
    
    campaignEdit(campaign){
        this.props.campaignEdit(campaign);
    }
    
    render(){
        
        
        var ret = this.props.campaigns.map(
            (val) => {
                return(
                    <Campaign 
                        onEdit={this.campaignEdit}
                        key={val.id}
                        data={val} 
                    />
                )
            }
        );
        
        return(
            <div>
                <h4>{this.props.title}</h4>
                <div>{ret}</div>
            </div>
        )
    }
}