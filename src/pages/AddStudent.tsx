import React, { useState } from 'react';
//import MainUi from '../components/MainUi';
import { useMutation, gql } from '@apollo/client';
import { Button, Modal, Input } from 'antd';

const ADD_STUDENT = gql`
    mutation Mutation($student: StudentInput!) {
        AddStudent(student: $student)
    }
`;

const AddStudent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentName, setStudentName] = useState('');
    

    const [addStudent] = useMutation(ADD_STUDENT, {
        onCompleted: () => {
            setIsModalOpen(false);
            setStudentName('');
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        addStudent({ variables: { student: { name: studentName } } });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setStudentName('');
    };

    return (
        
            <>
                <Button type="primary" onClick={showModal}>
                    Register New Student
                </Button>
                <Modal title="Register Student" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <h1>Register Student</h1>
                    <Input
                        placeholder='Student Name'
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                    />
                </Modal>
            </>
        
    );
};

export default AddStudent;
