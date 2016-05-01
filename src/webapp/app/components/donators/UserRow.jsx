import React from 'react';
import Profile from './Profile';

export default class UserRow extends React.Component{
    
     constructor(props){
        super(props);
        
    }
    
    click(){
        var userData = this.props.data;
        this.props.onUpdate(userData); //update parent
    }
    
    
    render(){
        var data = this.props.data;
        var td = this.props.columns.map(function table(row){
            return(
                  <td key={row.prop}>{ data[row.prop] }</td>
            );
        });
        
        return(
            <tr>
                {td}
                <td key="edit" onClick={this.click.bind(this)}>Edit</td>
            </tr>
        );
    }
}