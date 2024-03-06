import React from 'react'

import { Button } from 'antd';


interface props {
    studentId: string; 
    courseId: string;
    onRemove: () => void; 
}

function RemoveCourse({ onRemove }: props) {
    
    return (
        <Button onClick={onRemove} style={{color:'#cc0000'}}>
            Remove
        </Button>
    );
}

export default RemoveCourse