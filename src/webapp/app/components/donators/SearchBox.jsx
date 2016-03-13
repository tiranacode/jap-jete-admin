import React from 'react';

export default class SearchBox extends React.Component{
    
    constructor(props){
        super(props);
        
        this.state = {
            
        };
    }
    
    render(){
        return (
            <div>
                <input type="text" placeholder="Kerko" />
            </div>
        );
    }
}