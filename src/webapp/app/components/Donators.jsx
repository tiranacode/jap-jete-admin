import React from 'react';
import SearchBox from './donators/SearchBox';
import BloodFilter from './forms/BloodFilter';
import UsersList from './donators/UsersList';
import Profile from './donators/Profile';
import Rest from './../utils/Rest';
import {Endpoints} from './../configs/Url';
import LoginController from './../utils/LoginController';


export default class Donators extends React.Component{
    
    constructor(props){
        super(props);
        this.editUser = this.editUser.bind(this);
        this.state = {
            data: [],
            users: [],
            profileData: {
                
            }
        };
       
    }
    
    componentDidMount(){
        
        self = this.users;
        //sample
        Rest.readJSON( Endpoints.Users + LoginController.GetSessionAsParams(), {},
            (res) => {
                this.setState({
                    users: res,
                    profileData: res[0]
                });
            }, 
            (res) => {
                console.error(res);
            });
    }
    
    editUser(user){
        this.setState({
            profileData: user
        });
    }
    
    render(){
        return(
            <div className="donators row">
                <div className="SearchContainer col-md-8">
                    <div className="SearchHeader box-shadow">
                        <SearchBox />
                        <BloodFilter />
                    </div>
                    <div className="SearchBody component box-shadow">
                        <UsersList 
                            data={this.state.users} 
                            editUser={this.editUser} 
                        />
                    </div>
                </div>
                <div className="col-md-4 ">
                    <div className="ProfileContainer component box-shadow"> 
                        <Profile data={this.state.profileData} />
                    </div>
                </div>
            </div>
        );
    }
}
