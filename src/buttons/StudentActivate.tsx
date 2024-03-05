import React, { useState } from 'react';
import { Button } from 'antd';

interface Props {
    state: boolean;
    onMutation: any;
}

function StudentActivate({ state,  onMutation }: Props) {

    const [activeStatus, setActiveStatus] = useState(state);
    const toggleActiveStatus = () => {
        setActiveStatus((prevActiveState) => !prevActiveState)
        onMutation(activeStatus)
    };

    return (
        <div>
            <Button onClick={toggleActiveStatus} style={{ margin: '10px 0', color: '#0000cc' }}>
                {activeStatus ? 'Deactivate' : 'Activate'}
            </Button>
        </div>
    );
}

export default StudentActivate;
