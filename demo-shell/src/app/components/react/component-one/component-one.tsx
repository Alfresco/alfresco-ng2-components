import * as React from 'react';
// tslint:disable-next-line: no-duplicate-imports
import { FunctionComponent } from 'react';
import { Switch, Button } from 'antd';

export interface HelloReactProps {
    name: string;
    onClick?: () => void;
}

export const HelloReact: FunctionComponent<HelloReactProps> = (
    props: HelloReactProps
) => {
    const { name: name, onClick } = props;
    const style = {
        width: 200
    };

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    function onChange(checked) {
        console.log(`switch to ${checked}`);
    }

    // ReactDOM.render(<Switch defaultChecked onChange={onChange} />, mountNode);

    return (
        <div>
            <div style={style}>
                <img src='https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' />
            </div>
            <div>Hello {name}</div>
            <Button type="primary" onClick={handleClick}>Click me!</Button>
            <Switch defaultChecked onChange={onChange} />
        </div>
    );
};
