import React from 'react';
import Campaign from './Campaign';

export default class CampaignsList extends React.Component{
    
    render(){
        
        var ret = this.props.campaigns.map(
            (val) => {
                return(
                    <Campaign key={val.id}
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