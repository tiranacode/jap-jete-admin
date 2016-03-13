import React from 'react';
import Header from './header/Header'
import SearchBox from './components/donators/SearchBox'

export default class App extends React.Component {
    
    render() {
        return (
            <div>
                <Header />
                <div className="container">
                    <SearchBox />
                </div>
                
            </div>
        );
    }
    
}
