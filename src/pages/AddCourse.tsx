import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Modal, Input } from 'antd';

const ADD_COURSE = gql`
    mutation Mutation($course: CourseInput!) {
        AddCourse(course: $course)
    }
`;

function AddCourse({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const [courseName, setCourseName] = useState('');

    const [addCourse] = useMutation(ADD_COURSE, {
        onCompleted: () => {
            onClose();
            setCourseName('');
        },
    });

    const handleOk = () => {
        addCourse({ variables: { course: { name: courseName } } });
    };

    const handleCancel = () => {
        onClose(); // Close modal on cancel
        setCourseName('');
    };

    return (
        <Modal
            title="Create Course"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Input
                placeholder='Enter New Course Name'
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
            />
        </Modal>
    );
}

export default AddCourse;
