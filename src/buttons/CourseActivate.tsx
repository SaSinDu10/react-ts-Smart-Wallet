import React from 'react'
import { useMutation, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';

interface Props {
    state: boolean;
}

const UPDATE_COURSE = gql`
    mutation Mutation($courseId: ObjectId!, $course: CourseUpdate!) {
        UpdateCourse(courseId: $courseId, course: $course)
    }
`;

function CourseActivate({ state }: Props) {
    const { courseId } = useParams();
    const [updateCourse] = useMutation(UPDATE_COURSE);

    const toggleActiveStatus = async () => {
        try {
            const { data } = await updateCourse({
                variables: {
                    courseId: courseId,
                    course: { "isActive": !state }
                },
            });

            if (data.UpdateCourse.isActive) {
                window.location.reload();
            }
            
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };
    return (
        <div>
            <Button onClick={toggleActiveStatus}>
                {state ? 'Deactivate' : 'Activate'}
            </Button>
        </div>
    )
}

export default CourseActivate