import React from 'react';
import UserRow from './UserRow';

export default class UsersList extends React.Component{
    
    constructor(props){
        super(props);
        
        this.state = {
            selectedUser: 0
        };
    }
    
    onUpdate(selectedVal) {
        
        this.props.editUser(selectedVal);
        console.log(selectedVal);
    }
    
    
    render(){
        
        var columns = [
            { title: 'ID', prop: 'user_id'  },
            { title: 'Emri', prop: 'name'  },
            { title: 'Mbiemri', prop: 'surname' },
            { title: 'Grup Gjaku', prop: 'blood_type' }
        ];
        
        //render table head
        var head = [];
        for(var i of columns){
            head.push(<th key={i.prop}>{i.title}</th>);
        }
        
        //render table rows
        var body = [];
        for(var i of this.props.data){
            body.push(<UserRow onUpdate={this.onUpdate.bind(this)} 
                        key={i.user_id} data={i} columns={columns} />);
        }
        
        return (
            <div>
                <p>{this.state.selectedVal}</p>
                <table className="UsersTable table">
                    <thead><tr>{head}</tr></thead>
                    <tbody>{body}</tbody>
                </table>
            </div>
        )
    }
}
