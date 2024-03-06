import React from 'react';
import {  Drawer } from 'antd';
import StudentProfile from '../pages/StudentProfile';

interface StudentDrawerProps {
    open: boolean;
    onClose: () => void;
    selectedStudentId: string | null; 
}

const StudentDrawer: React.FC<StudentDrawerProps> = ({ open, onClose, selectedStudentId }) => {
    return (
        <>
            <Drawer
                title="Student Profile"
                width={720}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                
            >
                {selectedStudentId && <StudentProfile studentId={selectedStudentId} />}
            </Drawer>
        </>
    );
};

export default StudentDrawer;
