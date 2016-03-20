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
            users: []  
        };
       
        
    }
    
    componentDidMount(){
        
        self = this.users;
        //sample
        Rest.readJSON( Endpoints.Users, {},
            (res) => {
                this.setState({users: res});
            }, 
            (res) => {
                console.error(res);
            });
    }
    
    
    render(){
        return(
            <div className="donators">
                <h1>Donators</h1>
                <div>
                    <SearchBox />
                    <BloodFilter />
                    <UsersList data={this.state.users} />
                    <Profile />
                </div>
            </div>
        );
    }
}