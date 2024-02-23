import React from 'react';
import { Divider, Table } from 'antd';
import { useQuery, gql } from '@apollo/client';
import MainUi from '../components/MainUi';
import { Link } from 'react-router-dom';

const GET_COURSES = gql`
query Query {
    GetCourses {
        _id
        isActive
        lastPaymentGeneration
        name
    }
}
`;

const Students = () => {
    const { loading, error, data } = useQuery(GET_COURSES);

    if (loading) return <p>Loading...</p>;

    if (error) {
        console.error('GraphQL Error:', error);
        return <p>Error loading data</p>;
    }

    console.log('GraphQL Data:', data.GetCourses);

    const columns = [
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
            title: 'Active',
            dataIndex: 'isActive',
            render: (isActive:boolean) => (isActive ? 'Yes' : 'No'),
        },
        {
            title: 'Payment Generation',
            dataIndex: 'lastPaymentGeneration',
            /*render: (lastPaymentGeneration: Date) => {
                const month = lastPaymentGeneration.toLocaleString('default', { month: 'long' });
                const year = lastPaymentGeneration.getFullYear();
                return `${month} ${year}`;
            },*/
        }
    ];

    return (
        <MainUi>
            <div>
                <Divider>Course Table</Divider>
                <Table columns={columns} dataSource={data.GetCourses} size="middle" />
            </div>
        </MainUi>
    );
};

export default Students;
