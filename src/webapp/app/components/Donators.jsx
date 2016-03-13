import React from 'react';
import SearchBox from './donators/SearchBox'

export default class Donators extends React.Component{
    
    constructor(props){
        super(props);
    }
    
    
    render(){
        return(
            <div className="donators">
                <h1>Donators</h1>
                <SearchBox />
            </div>
        );
    }
}