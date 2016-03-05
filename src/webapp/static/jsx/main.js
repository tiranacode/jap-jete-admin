var React = require('react');
var ReactDOM = require('react-dom');
var Profile = require('./profile.js');
var SearchBox = require('./searchbox.js');

var App = React.createClass({

    getInitialState: function(){
        return {};
    },

    render: function() {
        return (
           <div> <Profile /> </div>
        );
    }
});

 ReactDOM.render(<App />, document.getElementById("main"));
