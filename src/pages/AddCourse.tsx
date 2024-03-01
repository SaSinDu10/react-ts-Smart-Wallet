import React, { useState } from 'react';
import MainUi from '../components/MainUi';
import { useMutation, gql } from '@apollo/client';
import { Button, Modal, Input } from 'antd';

const ADD_COURSE = gql`
    mutation Mutation($course: CourseInput!) {
        AddCourse(course: $course)
    }
`;

function AddCourse() {
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [courseName, setCourseName] = useState(''); 

    const [addCourse] = useMutation(ADD_COURSE, {
        onCompleted: () => {
            setIsModalOpen(false);
            setCourseName('');
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        addCourse({ variables: { course: { name: courseName } } });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setCourseName('');
    };

    return (
        <MainUi>
            <>
                <Button type="primary" onClick={showModal}>
                    Create New Course
                </Button>
                <Modal title="Create Course" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <h1>Create Course</h1>
                    <Input
                        placeholder='Enter New Course Name'
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                    />
                </Modal>
            </>
        </MainUi>
    );

}

export default AddCourse;
