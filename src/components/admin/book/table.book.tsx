import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, message, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { deleteBookAPI, deleteUserAPI, getBooksAPI } from '@/services/api';
import { CSVLink } from 'react-csv';
import DetailBook from './detail.book';
import FormAddBook from './form.add.book';
import FormUpdateBook from './form.update.book';

type TSearch = {
    mainText: string,
    author: string,
}


const TableBook = () => {

    const [isOpenViewDetail, setIsOpenViewDetail] = useState<boolean>(false);
    const [dataDetail, setDataDetail] = useState<IBook | null>(null);

    const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false);
    const [isFormAddOpen, setIsFormAddOpen] = useState<boolean>(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IBook | null>(null);
    const [csvData, setCSVData] = useState<IBook[]>([]);

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });


    const actionRef = useRef<ActionType>();

    const columns: ProColumns<IBook>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'id',
            dataIndex: '_id',
            // copyable: true,
            hideInSearch: true,
            ellipsis: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a
                        onClick={() => {
                            setDataDetail(entity);
                            setIsOpenViewDetail(true);
                        }}
                        href='#'>{entity._id}</a>
                )
            },
        },
        {
            title: 'Book Name',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            hideInSearch: true,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: "Price",
            dataIndex: 'price',
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.price)}
                    </>
                )
            },
            hideInSearch: true,
            sorter: true,
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Action',
            dataIndex: 'title',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditOutlined
                            style={{
                                color: '#f59f00',
                                marginRight: '20px',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setIsModalUpdateOpen(true);
                                setDataUpdate(entity);
                            }}
                        />
                        <Popconfirm
                            placement="leftBottom"
                            title={"Delete Book"}
                            description={"Are you sure to delete this Book?"}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{ loading: isDeleteBook }}
                            onConfirm={async () => {
                                setIsDeleteBook(true);
                                const res = await deleteBookAPI(entity._id);
                                if (res && res.data) {
                                    message.success('Delete Book successfully');
                                    refreshTable();
                                } else {
                                    message.error(res.message);
                                }
                                setIsDeleteBook(false);
                            }}
                        >
                            <DeleteOutlined
                                style={{
                                    color: '#f03e3e',
                                    cursor: 'pointer'
                                }}

                            />
                        </Popconfirm>
                    </>
                )
            }
        }
    ];

    const refreshTable = () => {
        actionRef?.current?.reload();
    }


    return (
        <>
            <ProTable<IBook, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    // console.log(params, sort, filter);
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}&sort=-createdAt`;
                    }

                    if (params.mainText) {
                        query += `&mainText=/${params.mainText}/i`;
                    }
                    if (params.author) {
                        query += `&author=/${params.author}/i`;
                    }
                    if (sort && sort.updatedAt) {
                        query += `&sort=${sort.updatedAt === 'ascend' ? "createdAt" : "-createdAt"}`;
                    } else {
                        query += `&sort=-createdAt`;
                    }

                    if (sort && sort.price) {
                        query += `&sort=${sort.price === 'ascend' ? "price" : "-price"}`;
                    }

                    if (sort && sort.author) {
                        query += `&sort=${sort.author === 'ascend' ? "author" : "-author"}`;
                    }

                    if (sort && sort.mainText) {
                        query += `&sort=${sort.mainText === 'ascend' ? "mainText" : "-mainText"}`;
                    }

                    const res = await getBooksAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCSVData(res?.data?.result ?? []);
                    }

                    return {
                        data: res.data?.result,
                        "page": res.data?.meta.pages,
                        "success": true,
                        "total": res.data?.meta.total
                    }

                }}
                editable={{
                    type: 'multiple',
                }}
                rowKey="_id"
                pagination={{
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    defaultPageSize: 5,
                    // total: 
                    // onChange: (page) => setMeta({ ...meta, current: page }),
                    // onShowSizeChange: onShowSizeChange,
                }}
                dateFormatter="string"
                headerTitle="Table Book"
                toolBarRender={() => [
                    <CSVLink filename='export-book.csv' data={csvData}>

                        <Button
                            key="button"
                            icon={<ExportOutlined />}
                            type="primary"
                        >
                            Export
                        </Button>
                    </CSVLink>,
                    // <Button
                    //     key="button"
                    //     icon={<CloudDownloadOutlined />}
                    //     onClick={() => {
                    //         setOpenModalImport(true);
                    //     }}
                    //     type="primary"
                    // >
                    //     Import
                    // </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
                            setIsFormAddOpen(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
            <DetailBook
                isOpenViewDetail={isOpenViewDetail}
                setIsOpenViewDetail={setIsOpenViewDetail}
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
            />
            <FormAddBook
                isFormAddOpen={isFormAddOpen}
                setIsFormAddOpen={setIsFormAddOpen}
                refreshTable={refreshTable}
            />
            <FormUpdateBook
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                refreshTable={refreshTable}
            />
        </>
    )
}

export default TableBook;