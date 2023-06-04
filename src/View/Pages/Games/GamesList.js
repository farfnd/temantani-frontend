import React, { useContext, useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { Typography, Button, Table, Space, message, Input } from 'antd';
import { GamesContext } from "../../../Contexts/GamesContext";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import Cookies from "js-cookie";

const GamesList = () => {
    const {
        games, setGames,
        inputData, setInputData,
        currentId, setCurrentId,
        fetchStatus, setFetchStatus,

        fetchData,
        fetchDataById,
        submitData,
        updateData,
        deleteData
    } = useContext(GamesContext)

    useEffect(() => {
        document.title = 'Games List'
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
            history.push(`/games/edit/${id}`)
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps('name'),
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
                    text: 'Fighting',
                    value: 'Fighting',
                },
                {
                    text: 'Horror',
                    value: 'Horror',
                },
                {
                    text: 'MOBA',
                    value: 'MOBA',
                },
                {
                    text: 'Puzzle',
                    value: 'Puzzle',
                },
                {
                    text: 'RPG',
                    value: 'RPG',
                },
                {
                    text: 'Shooter',
                    value: 'Shooter',
                },
                {
                    text: 'Survival',
                    value: 'Survival',
                },
            ],

            onFilter: (value, record) => record.genre.toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.genre.localeCompare(b.genre),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Release',
            dataIndex: 'release',
            key: 'release',
            sorter: (a, b) => a.release - b.release,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Platform',
            dataIndex: 'platform',
            key: 'platform',
            filters: [
                {
                    text: 'PC',
                    value: 'pc',
                },
                {
                    text: 'Android',
                    value: 'android',
                },
                {
                    text: 'iOS',
                    value: 'ios',
                },
                {
                    text: 'Console',
                    value: 'console',
                },
            ],

            onFilter: (value, record) => record.platform.toLowerCase().includes(value),
            sorter: (a, b) => a.platform.localeCompare(b.platform),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Mode',
            filters: [
                {
                    text: 'Single Player',
                    value: 'singlePlayer',
                },
                {
                    text: 'Multi Player',
                    value: 'multiplayer',
                },
            ],

            onFilter: (value, record) => record[value] == 1,
            render: (record) =>
                record.singlePlayer ? (record.multiplayer ? `Single Player, Multi Player` : 'Single Player') : (record.multiplayer ? 'Multi Player' : ''),
            sorter: (a, b) => (a.singlePlayer + a.multiplayer) - (b.singlePlayer + b.multiplayer),
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

    const data = games;

    return (
        <>
            <Title>Games List</Title>
            <Table columns={columns} dataSource={data} id="appTable" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} />
        </>
    )
}

export default GamesList