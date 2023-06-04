import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { Typography, Button, Table, Space, message, Input } from 'antd';
import { MoviesContext } from "../../../Contexts/MoviesContext";

import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import Cookies from "js-cookie";

const MoviesList = () => {

    const {
        movies, setMovies,
        inputData, setInputData,
        currentId, setCurrentId,
        fetchStatus, setFetchStatus,

        fetchData,
        fetchDataById,
        submitData,
        updateData,
        deleteData
    } = useContext(MoviesContext)

    useEffect(() => {
        document.title = 'Movies List'
        fetchData()
    }, [])

    let history = useHistory();
    const [searchText, setSearchText] = useState("")
    const [searchedColumn, setSearchedColumn] = useState("")

    const { Title } = Typography;

    const handleUpdate = (event) => {
        if(Cookies.get('token') === undefined){
            message.error('You are not logged in. Please log in first!')
        } else{
            let id = parseInt(event.currentTarget.value)
            history.push(`/movies/edit/${id}`)
        }
    }

    const handleDelete = (event) => {
        if(Cookies.get('token') === undefined){
            message.error('You are not logged in. Please log in first!')
        } else{
            let id = parseInt(event.currentTarget.value)
            deleteData(id)

            message.success('Successfully deleted data!');
        }
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    };

    var searchInput = "";

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => {
                        setSearchText("")
                        clearFilters();
                        confirm({ closeDropdown: true });
                    }} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0])
                            setSearchedColumn(dataIndex)
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },
        render: text =>
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

    const columns = [
        {
            title: 'No',
            render: (text, record, index) => index + 1
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps('title'),
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            filters: [
                {
                    text: '0-60 mins',
                    value: [0, 60],
                },
                {
                    text: '61-90 mins',
                    value: [61, 90],
                },
                {
                    text: '91-120 mins',
                    value: [91, 120],
                },
                {
                    text: '>120 mins',
                    value: [120, Number.MAX_SAFE_INTEGER],
                },
            ],
            onFilter: (value, record) => record.duration >= value[0] && record.duration <= value[1],
            sorter: (a, b) => a.duration - b.duration,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Genre',
            dataIndex: 'genre',
            key: 'genre',
            filters: [
                {
                    text: 'Action',
                    value: 'Action',
                },
                {
                    text: 'Adventure',
                    value: 'Adventure',
                },
                {
                    text: 'Animation',
                    value: 'Animation',
                },
                {
                    text: 'Comedy',
                    value: 'Comedy',
                },
                {
                    text: 'Drama',
                    value: 'Drama',
                },
                {
                    text: 'Fantasy',
                    value: 'Fantasy',
                },
                {
                    text: 'Horror',
                    value: 'Horror',
                },
                {
                    text: 'Romance',
                    value: 'Romance',
                },
                {
                    text: 'Thriller',
                    value: 'Thriller',
                },
            ],

            onFilter: (value, record) => record.genre.toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.genre.localeCompare(b.genre),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
            sorter: (a, b) => a.year - b.year,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            filters: [
                {
                    text: '0',
                    value: 0,
                },
                {
                    text: '1',
                    value: 1,
                },
                {
                    text: '2',
                    value: 2,
                },
                {
                    text: '3',
                    value: 3,
                },
                {
                    text: '4',
                    value: 4,
                },
                {
                    text: '5',
                    value: 5,
                },
                {
                    text: '6',
                    value: 6,
                },
                {
                    text: '7',
                    value: 7,
                },
                {
                    text: '8',
                    value: 8,
                },
                {
                    text: '9',
                    value: 9,
                },
                {
                    text: '10',
                    value: 10,
                },
            ],
            onFilter: (value, record) => {
                return parseInt(record.rating) === value
            },
            sorter: (a, b) => a.rating - b.rating,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Review',
            dataIndex: 'review',
            key: 'review',
            sorter: (a, b) => a.review.localeCompare(b.review),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Button type="primary" onClick={handleUpdate} value={record.id}>Edit</Button>
                    <br />
                    <Button type="danger" onClick={handleDelete} value={record.id}>Delete</Button>
                </Space>
            ),
        },
    ];

    const data = movies;

    return (
        <>
            <Title>Movies List</Title>
            <Table columns={columns} dataSource={data} id="appTable" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} />
        </>
    )
}

export default MoviesList