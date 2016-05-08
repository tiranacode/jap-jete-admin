import React from 'react';

export default class Campaign extends React.Component{
    
    constructor(params){
        super(params);
        this.onClick = this.onClick.bind(this);
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
                    </a>
                    <span className="right">
                        <button 
                            onClick={this.endCampaign} 
                            className="btn"
                        >{this.state.buttonText}</button>
                    </span>
                
                </div>
                <span>{this.props.data.startDate}</span>
            </div>
        )
    }
    
}




