import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';

interface Props {
    state: boolean;
}

const UPDATE_STUDENT = gql`
    mutation Mutation($studentId: ObjectId!, $student: StudentUpdate!) {
        UpdateStudent(studentId: $studentId, student: $student)
    }
`;

function StudentActivate({ state }: Props) {
    const { studentId } = useParams();
    const [updateStudent] = useMutation(UPDATE_STUDENT);

    const toggleActiveStatus = async () => {
        try {
            const { data } = await updateStudent({
                variables: {
                    studentId: studentId,
                    student: { "isActive": !state }
                },
            });

            if (data.UpdateStudent.isActive) {
                window.location.reload();
            }
            
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    return (
        <div>
            <button onClick={toggleActiveStatus}>
                {state ? 'Deactivate' : 'Activate'}
            </button>
        </div>
    );
}

export default StudentActivate;
