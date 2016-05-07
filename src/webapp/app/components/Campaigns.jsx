import React from 'react';
import BloodFilter from './forms/BloodFilter';
import {Endpoints} from './../configs/Url';
import Rest from './../utils/Rest';


export default class Campaigns extends React.Component{
    
    constructor(props){
        super(props);
        
        this.updateTitle = this.updateTitle.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.createCampaign = this.createCampaign.bind(this);
        
        this.state = {
            hospital: "Qendra Spitalore Universitare Tirane",
            title: "",
            message: "",
            datetime: ""
        }
    }
    
    componentDidMount(){
        // Rest.readJSON( Endpoints.Campaigns, {},
        //     (res) => {
        //         console.log(res);
        //     }, 
        //     (res) => {
        //         console.error(res);
        //     });
        
    }
    
    createCampaign(){
        if(this.state.title == "" || this.state.message == "")
            return;
        
        var data = {
            name: this.state.title,
            message: this.state.message
        }
            
        Rest.createJSON(Endpoints.CreateCampaign, data,
            (res) => {
                console.log(res);
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
    
    render(){
        return (
            <div className="campaigns row">
                <div className="col-md-5">
                    <div className="box-shadow component">
                        {this.state.hospital}
                    </div>
                </div>
                <div className="col-md-7 campaigns-right">
                    <div className="box-shadow">
                        <BloodFilter />
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
                                />
                                <textarea 
                                    className="form-control" 
                                    placeholder="Mesazhi i fushates"
                                    onChange={this.updateMessage}
                                ></textarea>
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
