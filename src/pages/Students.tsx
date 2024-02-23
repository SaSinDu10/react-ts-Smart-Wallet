import React from 'react';
import { Divider, Table } from 'antd';
import { useQuery, gql } from '@apollo/client';
import MainUi from '../components/MainUi';
import { Link } from 'react-router-dom';

const GET_STUDENTS = gql`
    query GetStudents {
        GetStudents {
        _id
        isActive
        name
        }
    }
`;

const Students = () => {
    const { loading, error, data } = useQuery(GET_STUDENTS);
    

    if (loading) return <p>Loading...</p>;

    if (error) {
        console.error('GraphQL Error:', error);
        return <p>Error loading data</p>;
    }

    const columns = [
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
            title: 'Active',
            dataIndex: 'isActive',
            render: (isActive: boolean) => (isActive ? 'Yes' : 'No'),
        },
    ];

    return (
        <MainUi>
            <div>
                <Divider>Student Table</Divider>
                <Table columns={columns} dataSource={data.GetStudents} size="middle" />
            </div>
        </MainUi>
    );
};

export default Students;
