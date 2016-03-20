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
        
        this.data = {};
        
        //sample
        Rest.readJSON( Endpoints.BloodTypes, {},
            (res) => {
                console.log(res)
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
                    <UsersList data={0} />
                    <Profile />
                </div>
            </div>
        );
    }
}