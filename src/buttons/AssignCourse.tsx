import React, { useState } from 'react';
import { Button, Modal, Dropdown, Menu } from 'antd';
import { useMutation, gql, useQuery } from '@apollo/client';

const ASSIGN_COURSE = gql`
    mutation AssignCourse($studentId: ObjectId!, $courseId: ObjectId!) {
        AssignCourseToStudent(studentId: $studentId, courseId: $courseId)
    }
`;

const GET_COURSES = gql`
    query GetCourses {
        GetCourses {
            _id
            name
        }
    }
`;

interface Props {
    studentId: string;
    courses: { _id: string; name: string }[];
}

function AssignCourse({ studentId, courses }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assignCourseToStudent] = useMutation(ASSIGN_COURSE);
    const { loading, error, data } = useQuery(GET_COURSES);

    const handleAssignCourse = async (courseId: string) => {
        try {
            await assignCourseToStudent({
                variables: {
                    studentId: studentId,
                    courseId: courseId
                }
            });
            setIsModalOpen(false);

        } catch (error) {
            console.error('Error assigning course:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching courses.</p>;

    const allCourses = data.GetCourses;

    const menu = (
        <Menu>
            {allCourses.map((course: { _id: string; name: string }) => (
                <Menu.Item key={course._id} onClick={() => handleAssignCourse(course._id)}>
                    {course.name}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)} style={{margin:'10px 0'}}>
                Assign a Course
            </Button>
            <Modal title="Assign Course" visible={isModalOpen} onCancel={handleCancel} footer={null}>
                <Dropdown overlay={menu}>
                    <Button>Select a Course</Button>
                </Dropdown>
            </Modal>
        </>
    );
}

export default AssignCourse;
