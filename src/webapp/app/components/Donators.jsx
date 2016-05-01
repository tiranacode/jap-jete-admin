import React from 'react';
import SearchBox from './donators/SearchBox';
import BloodFilter from './donators/BloodFilter';
import UsersList from './donators/UsersList';
import Profile from './donators/Profile';
import Rest from './../utils/Rest';
import {Endpoints} from './../configs/Url';


export default class Donators extends React.Component{
    
    constructor(props){
        super(props);
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
        Rest.readJSON( Endpoints.Users, {},
            (res) => {
                this.setState({
                    users: res,
                    profileData: res[0]
                });
            }, 
            (res) => {
                console.error(res);
            });
        // this.setState({users: [
        //     {
        //         'user_id': 1,
        //         'blood_type': 'a',
        //         'name': 'aleksander',
        //         'surname': 'bello',
        //         'email': 'bello@bello',
        //         'address': 'ca',
        //         'phone_number': 'ca'
        //     }
        // ]});
    }
    
    editUser(user){
        this.setState({
            profileData: user
        });
    }
    
    render(){
        return(
            <div className="donators">
                <div className="SearchContainer">
                    <div className="SearchHeader box-shadow">
                        <SearchBox />
                        <BloodFilter />
                    </div>
                    <div className="SearchBody box-shadow">
                        <UsersList data={this.state.users} editUser={this.editUser.bind(this)} />
                    </div>
                </div>
                <div className="ProfileContainer box-shadow"> 
                    <Profile data={this.state.profileData} />
                </div>
            </div>
        );
    }
}
