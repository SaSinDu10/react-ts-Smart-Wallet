import React from 'react';
import MainUi from "../components/MainUi";
import { useQuery, gql } from '@apollo/client';
import { Button, Form, Input, Spin, Switch, Table, Tabs } from 'antd';
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

interface props {
    courseId: string;
}

const { TabPane } = Tabs;

const CourseProfile = (props: props) => {
    const { courseId } = useParams();
    const { loading, error, data } = useQuery(GET_COURSE, {
        variables: {
            getCourseId: props.courseId,
        },
    });

    if (loading) return <Spin tip="Loading">
        <div className="content" />
    </Spin>;

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
                <Tabs defaultActiveKey="1" centered>
                    <TabPane tab="Course Details" key="1" style={{ margin: '24px' }}>
                        <Form
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 14 }}
                            layout="vertical"
                            style={{ maxWidth: 600 }}>
                            <Form.Item label="Active" name="isActive" valuePropName="checked">
                                <Switch defaultChecked={data?.GetStudent.isActive} />
                            </Form.Item>
                            <h1>{course.name}</h1>
                            <CourseActivate state={course.isActive} />

                            <Form.Item label="Student_Id">
                                <Input disabled value={course._id} />
                            </Form.Item>
                            <Form.Item label="Student_Name">
                                <Input disabled value={course.name} />
                            </Form.Item>
                            <Table columns={columns1} dataSource={[course]} size="middle" pagination={false} />
                            <Form.Item style={{ margin: '50px 0' }}>
                                <Button>Update</Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane tab="Enrolled Courses" key="2" style={{ margin: '24px' }}>
                        <h2>Enrolled Courses</h2>
                        <GeneratePayment courseId={courseId} />
                        <Table columns={columns2} dataSource={course.students} size="middle" />
                    </TabPane>
                </Tabs>
            </div>
        </MainUi>
    );
};

export default CourseProfile;