import { Divider, Button, Input, Space, Table, Flex, Breadcrumb, Spin } from 'antd';
import { useQuery, gql } from '@apollo/client';
import MainUi from '../components/MainUi';
import React, { useRef, useState } from 'react';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { GetRef, TableColumnsType, TableColumnType,Tag } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import AddStudent from './AddStudent';
import StudentDrawer from '../students/StudentDrawer'

type InputRef = GetRef<typeof Input>;

interface DataType {
    key: string;
    _id: string;
    name: string;
    isActive: boolean;
}

type DataIndex = keyof DataType;

const GET_STUDENTS = gql`
    query Query($skip: Int) {
        GetStudents(skip: $skip) {
            name
            _id
            isActive
        }
    }
`;

const Students = () => {
    const { loading, error, data: dt1, fetchMore: fm1 } = useQuery(GET_STUDENTS);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [openAddStudent, setOpenAddStudent] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null); // Change type to string | null

    const [drawerVisible, setDrawerVisible] = useState(false);

    // const showDrawer = () => {
    //     setDrawerVisible(true);
    // };

    const onCloseDrawer = () => {
        setDrawerVisible(false);
    };

    const handleAddStudentButtonClick = () => {
        setOpenAddStudent(true);
    };

    const handleAddStudentModalClose = () => {
        setOpenAddStudent(false);
    };

    if (loading) return <Spin tip="Loading">
        <div className="content" style={{position:"fixed" ,top: '50%', left: '50%'}}/>
    </Spin>;

    if (error) {
        console.error('GraphQL Error:', error);
        return <p>Error loading data</p>;
    }

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current, 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Student Id',
            dataIndex: '_id',
            key: '_id',
            width: '40%',
            ...getColumnSearchProps('_id'),
            //render: (_id: string) => <Link to={`/Students/${_id}`}>{_id}</Link>,
            //render: (_id: string) => <Link to={`/StudentDrawer/${_id}`}>{_id}</Link>,
        },
        {
            title: 'Student Name',
            dataIndex: 'name',
            key: 'name',
            width: '40%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
    ];

    return (
        <MainUi>
            <Breadcrumb style={{ margin: "16px 16px" }} items={[{ title: "Home" }, { title: "Student" }]} />
            <Flex gap={16}>
                <Button size="large" type="primary"
                    style={{ margin: '0 16px ' }}
                    onClick={handleAddStudentButtonClick}
                    icon={<PlusOutlined/>}>
                    Register New Student
                </Button>
                <AddStudent visible={openAddStudent} onClose={handleAddStudentModalClose} />
                <Input.Search size="large" placeholder="Filter by keyword" style={{ margin: '0 16px 0 0' }} />
            </Flex>
            <div>
                <Divider >Students Table</Divider>
                <Table
                    columns={columns}
                    dataSource={dt1?.GetStudents}
                    style={{ margin: '0 16px' }}
                    pagination={{
                        pageSize: 9,
                        onChange: (page) => {
                            fm1({
                                variables: { skip: (page - 1) * 10 }
                            });
                            console.log(dt1.GetStudents);
                        }
                    }}
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                console.log("Clicked row:", record);
                                if (record) {
                                    setSelectedStudentId(record._id);
                                    setDrawerVisible(true);
                                } else {
                                    console.error("Record is null or undefined.");
                                }
                            }
                        };
                    }}
                />
            </div>
            <StudentDrawer open={drawerVisible} onClose={onCloseDrawer} selectedStudentId={selectedStudentId} />
        </MainUi>
    );
};

export default Students;
