import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import {Button, Table, Tabs, Tag } from 'antd';
import { Link } from 'react-router-dom';
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

const UPDATE_STUDENT = gql`
    mutation Mutation($studentId: ObjectId!, $student: StudentUpdate!) {
        UpdateStudent(studentId: $studentId, student: $student)
    }
`;

const REMOVE_COURSE = gql`
    mutation Mutation($studentId: ObjectId!, $courseId: ObjectId!) {
        RemoveCourseFromStudent(studentId: $studentId, courseId: $courseId)
    }
`;


interface props {
    studentId: string;
}

const { TabPane } = Tabs;

export default function StudentProfile(props: props) {
    
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [updateStudent] = useMutation(UPDATE_STUDENT);
    const [removeCourseFromStudent] = useMutation(REMOVE_COURSE);
    const { loading, error, data, refetch } = useQuery(GET_STUDENT, {
        variables: {
            getStudentId: props.studentId,
        },
    });
    
    const handleMutation = (activeStatus:boolean):void =>{
        try {
            updateStudent({
                variables: {
                    studentId: props.studentId,
                    student: { "isActive": !activeStatus }
                },
            });
            
        } catch (error) {
            console.error('Error updating student:', error);
        }
        
        refetch() 
    }
    const handleRemoveCourse = async (courseId: string) => {
        try {
            await removeCourseFromStudent({
                variables: {
                    studentId: props.studentId,
                    courseId: courseId,
                },
            });
            
            refetch()
        } catch (error) {
            console.error('Error removing course:', error);
        }
    };
    
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
            render: ()=> (
                <Tag color={student.isActive ? 'green' : 'red'}>
                    {student.isActive ? 'Active Student' : 'Inactive Student'}
                </Tag>),
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
            render: (isActive: boolean) => (
            <Tag color={isActive ? 'green' : 'red'}>
                {isActive ? 'Active' : 'Inactive'}
            </Tag>),
        },
        {
            title: 'De-Assign',
            render: (record: any) => (
                <RemoveCourse studentId={student._id} courseId={record._id} onRemove={() => handleRemoveCourse(record._id)} />
            ),
        },
    ];

    const handleCourseSelect = (courseId: string) => {
        setSelectedCourseId(courseId);
    };

    return (

        <div>

            <Tabs defaultActiveKey="1" centered>
                <TabPane tab="Student Details" key="1" style={{ margin: '24px' }}>
                    <h1>{student.name}</h1>
                    <StudentActivate state={student.isActive} onMutation = {handleMutation}/>
                    <Table columns={columns1} dataSource={[student]} size="middle" pagination={false} />
                </TabPane>
                <TabPane tab="Assign Courses" key="2" style={{ margin: '24px' }}>
                    <h2>Enrolled Courses</h2>
                    <AssignCourse
                        studentId={student._id}
                        courses={student.courses.map((course: { _id: string; name: string; }) => ({ _id: course._id, name: course.name }))} 
                        refetchCourses={refetch}/>
                    <Table columns={columns2} dataSource={student.courses} size="middle" pagination={false} />
                </TabPane>
                <TabPane tab="Payments" key="3" style={{ margin: '24px' }}>
                    <h2>Payments</h2>
                    {student.courses.map((course: { _id: string; name: string; }) => (
                        <Button key={course._id} onClick={() => handleCourseSelect(course._id)} style={{ margin:'16px',color: selectedCourseId === course._id ? '#29a329' : '#131307' }}>{course.name}</Button>
                    ))}
                    {selectedCourseId && (
                        <SelectCourse
                            studentId={student._id}
                            courseId={selectedCourseId}
                        />
                    )}
                </TabPane>
            </Tabs>
        </div>

    );
};

