import { gql, useMutation, useQuery } from '@apollo/client';
import { Table, Button, Spin } from 'antd';
import React from 'react';

const GET_PAYMENTS = gql`
    query Query($studentId: ObjectId!, $courseId: ObjectId!) {
        GetPayments(studentId: $studentId, courseId: $courseId) {
            _id
            time {
                added
                payed
            }
        }
    }
`;

const MARK_PAYMENT = gql`
    mutation MarkPaymentDone($paymentId: ObjectId!) {
        MarkPaymentDone(paymentId: $paymentId)
    }
`;

interface Payment {
    _id: string;
    time: {
        added: string;
        payed: string | null;
    };
}

interface Props {
    studentId: string;
    courseId: string;
}

function SelectCourse({ studentId, courseId }: Props) {
    const { loading, error, data } = useQuery(GET_PAYMENTS, {
        variables: {
            studentId,
            courseId,
        },
    });

    const [markPaymentDone] = useMutation(MARK_PAYMENT);

    if (loading) return <Spin tip="Loading">
        <div className="content" />
    </Spin>;

    if (error) {
        console.error('GraphQL Error:', error);
        return <p>Error loading data</p>;
    }

    const payments = data?.GetPayments || [];

    const handleMarkPayment = (paymentId: string) => {
        markPaymentDone({
            variables: {
                paymentId,
            },
        }).catch((error) => {
            console.error('Error marking payment as paid:', error);
        });
    };
    const formatDateTime = (dateTime: string) => {
        const date = new Date(dateTime);
        const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
        const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        return `${formattedDate} ${formattedTime}`;
    };

    const columns3 = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Period',
            dataIndex: 'time',
            render: (time: any) => {
                const addedDate = new Date(time.added);
                const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
                return addedDate.toLocaleDateString('en-US', options);
            },
        },
        {
            title: 'Date Payed',
            dataIndex: 'time',
            render: (time: any, record: Payment) => (
                <>
                    {time.payed ? formatDateTime(time.payed) : (
                        <Button onClick={() => handleMarkPayment(record._id)}>Mark as Paid</Button>
                    )}
                </>
            ),
        },
        {
            title: 'Payment Done',
            render: (record: Payment) => {
                const isPaid = !!record.time.payed;
                return isPaid ? 'Done' : 'Not Done Yet';
            },
        },
    ];

    return (
        <>
            <Table columns={columns3} dataSource={payments} size="middle" pagination={false}/>
        </>
    );
}

export default SelectCourse;
