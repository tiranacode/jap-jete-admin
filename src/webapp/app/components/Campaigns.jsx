import React from 'react';
import BloodFilter from './forms/BloodFilter';
import {Endpoints} from './../configs/Url';
import Rest from './../utils/Rest';
import CampaignsList from './campaigns/CampaignsList';


export default class Campaigns extends React.Component{
    
    constructor(props){
        super(props);
        
        this.updateTitle = this.updateTitle.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.createCampaign = this.createCampaign.bind(this);
        this.bloodFilterUpdate = this.bloodFilterUpdate.bind(this);
        
        this.state = {
            hospital: "Qendra Spitalore Universitare Tirane",
            title: "",
            message: "",
            datetime: "",
            action: "",
            bloodTypes: [],
            campaignsList: [
                {
                    id: 1,
                    title: "Hello",
                    startDate: "10/10/2015",
                    active: true,
                    bloodTypes: ["A+", "A-"],
                    message: "Hello Hello Hello"
                }, 
                {
                    id: 2,
                    title: "World",
                    startDate: "10/10/2015",
                    active: false,
                    bloodTypes: ["A+", "A-"],
                    message: "Hello Hello Hello"
                }]
        }
    }
    
    /**
     * Create a new campaign with given state input
     */
    createCampaign(event){
        event.preventDefault();
        if(this.state.title == "" || this.state.message == "")
            return;
        var self = this;
        var data = {
            name: this.state.title,
            message: this.state.message,
            bloodtypes: this.state.bloodTypes
        }
            
        Rest.createJSON(Endpoints.CreateCampaign, data,
            (res) => {
                console.log(res);
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
     * Called when a blood type is checked/unchecked
     */
    bloodFilterUpdate(bloodTypes){
        this.setState({
            bloodTypes: bloodTypes
        });
    }
    
    componentDidMount(){
        var data = {
            hospital_id: 8
        }
        
        Rest.readJSON( Endpoints.CampaignsList, data,
            (res) => {
                console.log(res);   
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
                
                console.log(obj);
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
                            title={this.state.hospital} 
                            campaigns={this.state.campaignsList}
                        />
                    </div>
                </div>
                <div className="col-md-7 campaigns-right">
                    <div className="box-shadow">
                        <BloodFilter onUpdate={this.bloodFilterUpdate} />
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
                                    onClick={this.createCampaign} 
                                    className="btn" 
                                    value="Nis fushaten"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
