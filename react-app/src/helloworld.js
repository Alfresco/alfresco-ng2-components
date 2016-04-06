var CommentBox = React.createClass({
    getInitialState: function() {
    return { accept: 'image/*', action: 'target.php', droppable: ''};
    },

    onChangeAccept: function(e) {
    this.setState({accept: e.target.value});
    },

    onChangeAction: function(e) {
        this.setState({action: e.target.value});
    },

    onChangeDroppable: function(e) {
        this.setState({droppable: e.target.checked});
    },

    render: function() {
        return (
            <div className="commentBox">
                <div className="container">
                <img className="nav-logo" src="http://facebook.github.io/react/img/logo.svg" width="60" height="60" />
                <h1>React</h1>
                <form>
                    <div className="form-group" >
                    <label htmlFor="exampleAction">File action</label>
                    <input className="form-control"  id="exampleAction" type="text"  onChange={this.onChangeAction} value={this.state.action} placeholder="action name"/>
                    </div>
                    <div className="form-group" >
                    <label htmlFor="exampleAction">File action</label>
                    <input className="form-control" onChange={this.onChangeAccept} value={this.state.accept} />
                    </div>
                    <div className="checkbox">
                        <label>
                        <input type="checkbox" onChange={this.onChangeDroppable}  defaultChecked={this.state.droppable} /> Enable drop area
                    </label>
                    </div>
                    <div className="panel panel-default">
                        <div className="panel-body">web component inside React</div>
                    <file-upload raised="true" accept={this.state.accept} droppable={this.state.droppable} target={this.state.action} multi="false"  >Choose File</file-upload>
                    </div>
                </form>
                </div>
            </div>
        );
    }
});
ReactDOM.render(
<CommentBox />,
    document.getElementById('example')
);
