import React from 'react';

export default class SearchBox extends React.Component{
    
    constructor(props){
        super(props);
        
    }
    
    render(){
        return (
            <div>
                <input 
                    id="search"
                    className="form-control" 
                    type="text" 
                    placeholder="Kerko" 
                />
            </div>
        );
    }
}