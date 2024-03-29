import React from 'react';
import MainUi from "../components/MainUi";
import { useQuery, gql } from '@apollo/client';
import { Divider, Table } from 'antd';
import { Link, useParams } from 'react-router-dom';
import CourseActivate from '../buttons/CourseActivate';
import GeneratePayment from '../buttons/GeneratePayment';

const GET_COURSE = gql`
    query Query($getCourseId: ObjectId!) {
    GetCourse(id: $getCourseId) {
            _id
            isActive
            lastPaymentGeneration
            name
            students {
                _id
                isActive
                name
            }
        }
    }
`;

const CourseProfile = () => {
    const { courseId } = useParams();
    const { loading, error, data } = useQuery(GET_COURSE, {
        variables: {
            getCourseId: courseId,
        },
    });

    if (loading) return <p>Loading...</p>;

    if (error) {
        console.error('GraphQL Error:', error);
        return <p>Error loading data</p>;
    }

    const course = data?.GetCourse;

    const columns1 = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        
        {
            title: 'State',
            dataIndex: 'isActive',
            render: (isActive: boolean) => (isActive ? 'Active Course' : 'Discontinued Course'),
        },
        {
            title: 'Last Payment Generate',
            dataIndex: 'lastPaymentGeneration',
        },
    ];

    const columns2 = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (_id: string) => <Link to={`/Students/${_id}`}>{_id}</Link>,
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
        
    ];

    return (
        <MainUi>
            <div>
                <Divider>Course Profile</Divider>
                <h1>{course.name}</h1>
                <CourseActivate state={course.isActive} />
                <Table columns={columns1} dataSource={[course]} size="middle" />
                <h2>Enrolled Students</h2>
                <GeneratePayment courseId={courseId} />
                <Table columns={columns2} dataSource={course.students} size="middle" />
            </div>
        </MainUi>
    );
};

export default CourseProfile;