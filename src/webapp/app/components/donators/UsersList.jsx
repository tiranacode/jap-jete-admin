import React from 'react';
import UserRow from './UserRow';

export default class UsersList extends React.Component{
    
    constructor(props){
        super(props);
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
            body.push(<UserRow key={i.user_id} data={i} columns={columns} />)
        }
        
        return (
            <div>
                <table className="UsersTable">
                    <thead><tr>{head}</tr></thead>
                    <tbody>{body}</tbody>
                </table>
            </div>
        )
    }
}
