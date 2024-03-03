import { Divider, Button, Input, Space, Table, Flex, Breadcrumb } from 'antd';
import { useQuery, gql } from '@apollo/client';
import MainUi from '../components/MainUi';
import { Link } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { GetRef, TableColumnsType, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import AddStudent from './AddStudent';

type InputRef = GetRef<typeof Input>;

interface DataType {
    key: string;
    _id: string;
    name: string;
    isActive: boolean;
}

type DataIndex = keyof DataType;

const GET_STUDENTS = gql`
    query GetStudents {
        GetStudents {
        _id
        isActive
        name
        }
    }
`;

const Students = () => {
    const { loading, error, data, fetchMore: fm1 } = useQuery(GET_STUDENTS);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [openAddStudent, setOpenAddStudent] = useState(false);

    const handleAddStudentButtonClick = () => {
        setOpenAddStudent(true);
    };

    const handleAddStudentModalClose = () => {
        setOpenAddStudent(false);
    };


    if (loading) return <p>Loading...</p>;

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
            render: (_id: string) => <Link to={`/Students/${_id}`}>{_id}</Link>,
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
            render: (isActive: boolean) => (isActive ? 'Yes' : 'No'),
        },
    ];

    return (
        <MainUi>
            <Breadcrumb style={{ margin: "16px 0" }} items={[{ title: "Home" }, { title: "Student" }]} />
            <Flex gap={16}>
                <Button size="large" type="primary" 
                style={{ margin:'5 px'}} 
                onClick={handleAddStudentButtonClick}>
                    Register New Student
                </Button>
                <AddStudent visible={openAddStudent} onClose={handleAddStudentModalClose} />
                <Input.Search size="large" placeholder="Filter by keyword" />
            </Flex>
            <div>
                <Divider>Student Table</Divider>
                <Table columns={columns} dataSource={data.GetStudents} style={{ margin: '20px' }}
                    pagination={{
                        pageSize: 9,
                        onChange: (page) => {
                            console.log(page);

                            fm1({
                                // variables: { skip: (page - 1) * 10 }
                                variables: { skip: 10 }
                            })
                            console.log(data.GetStudents);
                        }
                    }}
                // onRow={(record) => {
                //     return {
                //         onClick: () => {
                //             setSelectedProduct(record);
                //         }
                //     };
                // }} 

                />;

            </div>
        </MainUi>
    );
};

export default Students;
