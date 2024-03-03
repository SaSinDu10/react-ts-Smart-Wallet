import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { useMutation, gql } from '@apollo/client';

const ADD_STUDENT = gql`
    mutation Mutation($student: StudentInput!) {
        AddStudent(student: $student)
    }
`;

const AddStudent = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const [studentName, setStudentName] = useState('');
    const [addStudent] = useMutation(ADD_STUDENT);

    const handleOk = () => {
        addStudent({ variables: { student: { name: studentName } } });
        onClose(); 
    };

    const handleCancel = () => {
        onClose(); 
    };

    return (
        <Modal 
            title="Register Student" 
            visible={visible} 
            onOk={handleOk} 
            onCancel={handleCancel}>
                <Input
                    placeholder="Student Name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                />
        </Modal>
    );
};

export default AddStudent;
