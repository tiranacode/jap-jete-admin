import React from 'react';
import LoginController from './../utils/LoginController';

export default class Login extends React.Component{
    
    constructor(params){
        super(params);
        
        this.updateUsername = this.updateUsername.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.login = this.login.bind(this);
        
        this.state = {
            user: "",
            pass: ""
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
        
        //TODO
    }
    
    render(){
        return(
            <div className="login">
                <form role="form" action="">
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
                        <input 
                            type="submit" 
                            className="form-control"
                            onClick={this.login}
                        />
                    </div>
                </form>
            </div>
        )
    }
    
}