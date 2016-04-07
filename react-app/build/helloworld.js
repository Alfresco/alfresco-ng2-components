var CommentBox = React.createClass({
    displayName: 'CommentBox',

    getInitialState: function () {
        return { accept: 'image/*', action: 'http://192.168.99.100:8080/alfresco/service/api/upload', droppable: '' };
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
                { className: 'container' },
                React.createElement('img', { className: 'nav-logo', src: 'http://facebook.github.io/react/img/logo.svg', width: '60', height: '60' }),
                React.createElement(
                    'h1',
                    null,
                    'React'
                ),
                React.createElement(
                    'form',
                    null,
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            { htmlFor: 'exampleAction' },
                            'File action'
                        ),
                        React.createElement('input', { className: 'form-control', id: 'exampleAction', type: 'text', onChange: this.onChangeAction, value: this.state.action, placeholder: 'action name' })
                    ),
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            { htmlFor: 'exampleAction' },
                            'File action'
                        ),
                        React.createElement('input', { className: 'form-control', onChange: this.onChangeAccept, value: this.state.accept })
                    ),
                    React.createElement(
                        'div',
                        { className: 'checkbox' },
                        React.createElement(
                            'label',
                            null,
                            React.createElement('input', { type: 'checkbox', onChange: this.onChangeDroppable, defaultChecked: this.state.droppable }),
                            ' Enable drop area'
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'panel panel-default' },
                        React.createElement(
                            'div',
                            { className: 'panel-body' },
                            'web component inside React'
                        ),
                        React.createElement(
                            'file-upload',
                            { raised: 'true', accept: this.state.accept, droppable: this.state.droppable, target: this.state.action, multi: 'false' },
                            'Choose File'
                        )
                    )
                )
            )
        );
    }
});
ReactDOM.render(React.createElement(CommentBox, null), document.getElementById('example'));