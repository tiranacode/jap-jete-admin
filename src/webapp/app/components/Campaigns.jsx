import React from 'react';
import BloodFilter from './forms/BloodFilter';

export default class Campaigns extends React.Component{
    
    render(){
        return (
            <div className="campaigns row">
                <div className="col-md-6">
                    <div className="box-shadow component">
                        asdasd
                    </div>
                </div>
                <div className="col-md-6 campaigns-right">
                    <div className="box-shadow">
                        <BloodFilter />
                    </div>
                    <div className="box-shadow component">
                        
                    </div>
                </div>
            </div>
        );
    }
}
