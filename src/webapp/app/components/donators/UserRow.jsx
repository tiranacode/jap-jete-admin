import React from 'react';

export default class UserRow extends React.Component{
    
    click(){
        
    }
    
    render(){
        
        var data = this.props.data;
        var td = this.props.columns.map(function table(row){
            return(
                  <td key={row.prop}>{ data[row.prop]}</td>
            );
        });
        
        return(
            <tr>
                {td}
                <td key="edit" onClick={this.click}>Edit</td>
            </tr>
        );
    }
}