import React from 'react';
import { useMutation, gql } from '@apollo/client';

const GENERATE_PAYMENT = gql`
    mutation Mutation($courseId: ObjectId!) {
        GeneratePayments(courseId: $courseId)
    }
`;

interface Props {
    courseId?: string;
}

function GeneratePayment({ courseId }: Props) {
    const [generatePayment] = useMutation(GENERATE_PAYMENT);

    const handleGeneratePayment = async () => {
        try {
            await generatePayment({
                variables: {
                    courseId,
                },
            });
            alert(`Generated  Payment`);

            console.log('Payments generated successfully.');
        } catch (error) {
            console.error('Error generating payments:', error);
        }
    };

    return (
        <button onClick={handleGeneratePayment}>Generate Payments</button>
    );
}

export default GeneratePayment;
