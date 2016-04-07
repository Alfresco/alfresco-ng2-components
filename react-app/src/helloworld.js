var CommentBox = React.createClass({
    getInitialState: function() {
    return { accept: 'image/*', action: 'http://localhost:8888/alfresco/service/api/upload', droppable: ''};
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
                <div>
                        <form>
                            <file-upload raised='true' accept={this.state.accept} droppable='false' target={this.state.action}  multi='false'  ><iron-icon icon="icons:add"></iron-icon> Add File</file-upload>
                        </form>
                        <alfresco-file-list></alfresco-file-list>
                </div>
            </div>
        );
    }
});
ReactDOM.render(
<CommentBox />,
    document.getElementById('example')
);
