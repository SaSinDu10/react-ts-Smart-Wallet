import React from 'react'
import { useMutation, gql } from '@apollo/client';
import { Button } from 'antd';

const REMOVE_COURSE = gql`
    mutation Mutation($studentId: ObjectId!, $courseId: ObjectId!) {
        RemoveCourseFromStudent(studentId: $studentId, courseId: $courseId)
    }
`;

interface Props {
    studentId: string; 
    courseId: string;
    onRemove: () => void; 
}

function RemoveCourse({ studentId, courseId, onRemove }: Props) {
    const [removeCourseFromStudent] = useMutation(REMOVE_COURSE);

    const handleRemoveCourse = async () => {
        try {
            await removeCourseFromStudent({
                variables: {
                    studentId,
                    courseId,
                },
            });
            
            onRemove();
        } catch (error) {
            console.error('Error removing course:', error);
        }
    };
    

    return (
        <Button onClick={handleRemoveCourse}>
            Remove
        </Button>
    );
}

export default RemoveCourse