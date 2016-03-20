import React from 'react';
import {DataTable} from 'react-data-components';

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
        
        return (
            <div>
                <DataTable
                    className="usersList"
                    keys={[ 'name', 'surname' ]}
                    columns={columns}
                    initialData={this.props.data}
                    initialPageLength={5}
                    initialSortBy={{ prop: 'name', order: 'ascending' }}
                    pageLengthOptions={[ 5, 10, 30 ]}
                />
            </div>
        )
    }
}