var ServerCall = React.createClass({
  getInitialState: function() {
    return {
      message: ''
    }
  },

  componentDidMount: function() {
    this.serverRequest = $.get(this.props.source, function(result) {
      this.setState({
        message: result.message
      });
    }.bind(this));
  },

  componentWillUnount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    return (<strong>Server says: "{this.state.message}".</strong>);
  }
});

ReactDOM.render(
  <ServerCall source="/api/v1/hello"/>,
  document.getElementById('greeting')
);
