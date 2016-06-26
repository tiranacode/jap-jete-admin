import React from 'react';
import LoginController from './../utils/LoginController';
import { browserHistory } from 'react-router';

export default class Login extends React.Component{
    
    constructor(params){
        super(params);
        
        this.updateUsername = this.updateUsername.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.login = this.login.bind(this);
        
        this.state = {
            user: "",
            pass: "",
            message: ""
        }
    }
    
    updateUsername(event){
        this.setState({
            user: event.target.value
        });
    }
    
    updatePassword(event){
        this.setState({
            pass: event.target.value
        });
    }
    
    login(event){
        event.preventDefault();
        var self = this;
        LoginController.Login(this.state.user, this.state.pass,
        () => {
            browserHistory.push("/");
        }, (error) =>  {
            self.setState({
                message: error
            })
        });
        
    }
    
    render(){
        return(
            <div className="login">
                <form role="form" action="" onSubmit={this.login}>
                    <div className="form-group">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Perdoruesi"
                            onChange={this.updateUsername}
                        />
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Fjalekalimi"
                            onChange={this.updatePassword}
                        />
                        <span>
                            {this.state.message}
                        </span>
                        <input 
                            type="submit" 
                            className="form-control"
                        />
                    </div>
                </form>
            </div>
        )
    }
    
}