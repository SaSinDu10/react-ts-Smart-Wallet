import React, { useState } from 'react';
import MainUi from "../components/MainUi";
import { useQuery, gql } from '@apollo/client';
import { Divider, Table, Button, Dropdown, Menu } from 'antd';
import { Link, useParams } from 'react-router-dom';
import StudentActivate from '../buttons/StudentActivate';
import AssignCourse from '../buttons/AssignCourse';
import RemoveCourse from '../buttons/RemoveCourse';
import SelectCourse from '../buttons/SelectCourse';

const GET_STUDENT = gql`
    query GetStudent($getStudentId: ObjectId!) {
        GetStudent(id: $getStudentId) {
            _id
            isActive
            name
            courses {
                _id
                isActive
                lastPaymentGeneration
                name
            }
        }
    }
`;

const StudentProfile = () => {
    const { studentId } = useParams();
    console.log(studentId);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const { loading, error, data } = useQuery(GET_STUDENT, {
        variables: {
            getStudentId: studentId,
        },
    });


    if (loading) return <p>Loading...</p>;

    if (error) {
        console.error('GraphQL Error:', error);
        return <p>Error loading data</p>;
    }

    const student = data?.GetStudent;

    const columns1 = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            render: (isActive: boolean) => (isActive ? 'Active Student' : 'Inactive Student'),
        },
    ];

    const columns2 = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (_id: string) => <Link to={`/Courses/${_id}`}>{_id}</Link>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Course State',
            dataIndex: 'isActive',
            render: (isActive: boolean) => (isActive ? 'Yes' : 'No'),
        },
        {
            title: 'De-Assign',
            render: (record: any) => (
                <RemoveCourse studentId={student._id} courseId={record._id} onRemove={onRemove} />
            ),
        },
    ];

    const handleCourseSelect = (courseId: string) => {
        setSelectedCourseId(courseId);
    };

    const menu = (
        <Menu>
            {student.courses.map((course: { _id: string; name: string; }) => (
                <Menu.Item key={course._id} onClick={() => handleCourseSelect(course._id)}>
                    {course.name}
                </Menu.Item>
            ))}
        </Menu>
    );


    return (
        <MainUi>
            <div>
                <Divider>Student Profile</Divider>
                <h1>{student.name}</h1>
                <StudentActivate state={student.isActive} />
                <Table columns={columns1} dataSource={[student]} size="middle" />
                <h2>Enrolled Courses</h2>
                <AssignCourse
                    studentId={student._id}
                    courses={student.courses.map((course: { _id: string; name: string; }) => ({ _id: course._id, name: course.name }))} />
                <Table columns={columns2} dataSource={student.courses} size="middle" />
                <h2>Payments</h2>
                <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
                    <Button>Select a Course</Button>
                </Dropdown>

                {selectedCourseId && (
                    <SelectCourse
                        studentId={student._id}
                        courseId={selectedCourseId}
                    />
                )}
            </div>
        </MainUi>
    );
};

export default StudentProfile;


function onRemove(): void {
    throw new Error('Function not implemented.');
}