import React from 'react';
import MainUi from "../components/MainUi";
import { useQuery, gql } from '@apollo/client';
import { Divider, Table, Button } from 'antd';
import { Link, useParams } from 'react-router-dom';

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
    console.log(studentId)
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
            render: (isActive: boolean) => (isActive ? 'Yes' : 'No'),
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
            render: (record: any) => <Button onClick={() => deAssignCourse(record)}>De-Assign</Button>,
        },
    ];

    const deAssignCourse = (record: any) => {
        // To Do
        console.log('De-assign course:', record);
    };

    const toggleActiveStatus = () => {
        // To Do
    };

    return (
        <MainUi>
            <div>
                <Divider>Student Profile</Divider>
                <h1>{student.name}</h1>
                <Button onClick={toggleActiveStatus}>
                    {student.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Table columns={columns1} dataSource={[student]} size="middle" />
                <h2>Enrolled Courses</h2>
                <Table columns={columns2} dataSource={student.courses} size="middle" />
            </div>
        </MainUi>
    );
};

export default StudentProfile;
