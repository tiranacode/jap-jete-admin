import React from 'react';
import BloodFilter from './forms/BloodFilter';
import {Endpoints} from './../configs/Url';
import Rest from './../utils/Rest';
import CampaignsList from './campaigns/CampaignsList';
import LoginController from './../utils/LoginController';


export default class Campaigns extends React.Component{
    
    constructor(props){
        super(props);
        
        this.updateTitle = this.updateTitle.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.createCampaign = this.createCampaign.bind(this);
        this.bloodFilterUpdate = this.bloodFilterUpdate.bind(this);
        this.editCampaign = this.editCampaign.bind(this);
        this.startCampaignEdit = this.startCampaignEdit.bind(this);
        
        this.state = {
            hospital: "Qendra Spitalore Universitare Tirane",
            title: "",
            message: "",
            datetime: "",
            id: 0,                                          //id of campagin when editing
            action: "",                                     //message of request
            bloodTypes: [],                                 //list of bloodTypes selected 
            campaignsList: [],                              //list of all campaigns
            editMode: false,                                //wheather a campaign is being edited
            editCampaign: null                              //the campaign in edit mode
        }
    }
    
    /**
     * Create a new campaign with given state input
     */
    createCampaign(event){
        event.preventDefault();
        if(this.state.title == "" || this.state.message == "" || !LoginController.LoggedIn())
            return;
            
        var session = LoginController.GetSessionAsParams();
        var self = this;
        var data = {
            name: this.state.title,
            message: this.state.message,
            bloodtypes: this.state.bloodTypes
            
        }
            
        Rest.createJSON(Endpoints.CreateCampaign + session, data,
            (res) => {
                if(res.status && res.status == "ok")
                    self.setState({
                        title: "",
                        message: "",
                        action: "Fushata u fillua me sukses"
                    });
                else self.setState({
                        action: "Gabim"
                    });
            },
            (err) => {
                console.error(err);
            }
        );
        
    }
    
    /**
     * Send edited data
     */
    editCampaign(event){
        console.log("Editing")
        
        event.preventDefault();
        if(this.state.title == "" || this.state.message == "")
            return;
        
        var session = LoginController.GetSessionAsParams();
        var self = this;
        var data = {
            name: this.state.title,
            message: this.state.message,
            bloodtypes: this.state.bloodTypes
        }
        console.log(data);
        Rest.update(Endpoints.UpdateCampaign.replace("{0}",this.state.id) + session, data,
            (res) => {
                if(res.status && res.status == "ok")
                    self.setState({
                        title: "",
                        message: "",
                        action: "Fushata u ndryshua me sukses"
                    });
                else self.setState({
                        action: "Gabim"
                    });
            },
            (err) => {
                console.error(err);
            }
        );
        
    }
    
    updateTitle(event){
        this.setState({
            title: event.target.value
        });
    }
    
    updateMessage(event){
        this.setState({
            message: event.target.value
        });
    }
    
    /**
     * A campaign was clicked to edit
     */
    startCampaignEdit(campaign){
        this.setState({
            editMode: true,
            editCampaign: campaign,
            title: campaign.title,
            message: campaign.message,
            bloodTypes: campaign.bloodTypes,
            id: campaign.id
        });
    }
    
    /**
     * Called when a blood type is checked/unchecked
     */
    bloodFilterUpdate(bloodTypes){
        this.setState({
            bloodTypes: bloodTypes
        });
    }
    
    componentDidMount(){
        var session = LoginController.GetSessionAsParams();
        
        Rest.readJSON( Endpoints.CampaignsList + session, {},
            (res) => { 
                var obj = [];
                res.campaigns.map((val) =>{
                    obj.push({
                        id: val.id,
                        title: val.name,
                        startDate: val.start_date,
                        active: val.active,
                        bloodTypes: val.bloodtypes,
                        message: val.message
                    });
                });
                
                this.setState({
                    campaignsList: obj
                });
            }, 
            (res) => {
                console.error(res);
            });
    }
    
    render(){
        
        return (
            <div className="campaigns row">
                <div className="col-md-5">
                    <div className="box-shadow component">
                        <CampaignsList 
                            campaignEdit={this.startCampaignEdit}
                            title={this.state.hospital} 
                            campaigns={this.state.campaignsList}
                        />
                    </div>
                </div>
                <div className="col-md-7 campaigns-right">
                    <div className="box-shadow">
                        <BloodFilter 
                            onUpdate={this.bloodFilterUpdate} 
                            bloodTypes={this.state.bloodTypes}
                        />
                    </div>
                    <div className="box-shadow component">
                        <form action="" role="form">
                            <h4>{this.state.hospital}</h4>
                                
                            <div className="form-group">
                                <input 
                                    className="form-control" 
                                    type="text" 
                                    placeholder="Emri i fushates" 
                                    onChange={this.updateTitle}
                                    value={this.state.title}
                                />
                                <textarea 
                                    className="form-control" 
                                    placeholder="Mesazhi i fushates"
                                    onChange={this.updateMessage}
                                    value={this.state.message}
                                ></textarea>
                                
                                <span className="message">{this.state.action}</span>
                                <input 
                                    type="submit" 
                                    onClick={ this.state.editMode ? this.editCampaign : this.createCampaign} 
                                    className="btn" 
                                    value={ this.state.editMode ? "Perditeso" : "Nis"}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
