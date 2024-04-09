import React from 'react';
import {  Drawer } from 'antd';
import CourseProfile from '../pages/CourseProfile';

interface CourseDrawerProps {
    open: boolean;
    onClose: () => void;
    selectedCourseId: string | null;
}

const CourseDrawer: React.FC<CourseDrawerProps> = ({ open, onClose, selectedCourseId }) => {
    return (
        <>
            <Drawer
                title="Course Profile"
                width={720}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                
            >
                {selectedCourseId && <CourseProfile courseId={selectedCourseId} />}
            </Drawer>
        </>
    );
};

export default CourseDrawer;
