var CommentBox = React.createClass({
    displayName: 'CommentBox',

    getInitialState: function () {
        return { accept: 'image/*', action: 'http://localhost:8888/alfresco/service/api/upload', droppable: '' };
    },

    onChangeAccept: function (e) {
        this.setState({ accept: e.target.value });
    },

    onChangeAction: function (e) {
        this.setState({ action: e.target.value });
    },

    onChangeDroppable: function (e) {
        this.setState({ droppable: e.target.checked });
    },

    render: function () {
        return React.createElement(
            'div',
            { className: 'commentBox' },
            React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'form',
                        null,
                        React.createElement(
                            'file-upload',
                            { raised: 'true', accept: this.state.accept, droppable: 'false', target: this.state.action, multi: 'false' },
                            React.createElement('iron-icon', { icon: 'icons:add' }),
                            ' Add File'
                        )
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement('alfresco-file-list', null)
                )
            )
        );
    }
});
ReactDOM.render(React.createElement(CommentBox, null), document.getElementById('example'));