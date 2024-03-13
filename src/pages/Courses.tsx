import React, { useState } from 'react';
import { Breadcrumb, Button, Divider, Flex, Input, Spin, Table, Tag } from 'antd';
import {  PlusOutlined } from '@ant-design/icons';
import { useQuery, gql } from '@apollo/client';
import MainUi from '../components/MainUi';
import { Link } from 'react-router-dom';
import AddCourse from './AddCourse';

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
    const { loading, error, data,fetchMore } = useQuery(GET_COURSES);
    const [openAddCourse, setOpenAddCourse] = useState(false);

    const handleAddCourseButtonClick = () => {
        setOpenAddCourse(true);
    };

    const handleAddCourseModalClose = () => {
        setOpenAddCourse(false);
    };

    if (loading) return (<Spin tip="Loading">
        <div className="content" />
    </Spin>);

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
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
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
            <Breadcrumb style={{ margin: "16px 16px" }} items={[{ title: "Home" }, { title: "Course" }]} />
            <Flex gap={16}>
                <Button size="large" type="primary"
                    style={{ margin: '0 16px ' }}
                    onClick={handleAddCourseButtonClick}
                    icon={<PlusOutlined/>}>
                    Register New Course
                </Button>
                <AddCourse visible={openAddCourse} onClose={handleAddCourseModalClose} />
                <Input.Search size="large" placeholder="Filter by keyword" style={{ margin: '0 16px' }} />
            </Flex>
            <div>
                <Divider>Course Table</Divider>
                <Table 
                columns={columns} 
                dataSource={data.GetCourses} 
                size="middle" 
                style={{ margin: '0 16px' }}
                pagination={{
                    pageSize: 9,
                    onChange: (page) => {
                        fetchMore({
                            variables: { skip: (page - 1) * 10 }
                        });
                        console.log(data.GetStudents);
                    }
                }}
                />
            </div>
        </MainUi>
    );
};

export default Students;
