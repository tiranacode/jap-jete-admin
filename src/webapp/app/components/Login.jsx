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
                message: "Kredencialet e gabuara"
           })
        });
        
    }
    
    render(){
        var state = (<div className="alert alert-danger">
                            {this.state.message}
                     </div>)
        if (this.state.message == ""){
            state = (<div></div>)
        }

        return(<div className="login">
                    <div>
                        <form role="form" action="" onSubmit={this.login}>
                            <div className="form-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Perdoruesi"
                                    onChange={this.updateUsername}
                                />
                                <p></p>

                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="Fjalekalimi"
                                    onChange={this.updatePassword}
                                />
                            </div>
                            <input 
                                type="submit" 
                                className="btn-primary form-control"
                            />
                        </form>
                    </div>
                    {state}
                </div>
        )
    }
    
}