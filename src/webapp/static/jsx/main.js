var Profile = require('./profile.js');

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
