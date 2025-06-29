import { deleteUserAPI, getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { CloudDownloadOutlined, DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import ViewDetailUser from './view.detail.user';
import FormAddUser from './form.add.user';
import ImportUser from './data/import.user';
import { CSVLink } from 'react-csv';
import FormUpdateUser from './form.update.user';

type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}

const TableUser = () => {
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [dataDetail, setDataDetail] = useState<IUserTable | null>(null);
    const [isFormAddOpen, setIsFormAddOpen] = useState<boolean>(false);
    const [openModalImport, setOpenModalImport] = useState<boolean>(false);
    const [csvData, setCSVData] = useState<IUserTable[]>([]);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);

    const { message, notification } = App.useApp();


    const handleDeleteUser = async (id: string) => {
        const res = await deleteUserAPI(id);
        if (res.data) {
            message.success("User deleted");
            refreshTable();
        } else {
            notification.error({
                message: "Delete Failed",
                description: res.message,
            })
        }
    }

    const columns: ProColumns<IUserTable>[] = [
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
                            setIsOpen(true);
                        }}
                        href='#'>{entity._id}</a>
                )
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
        },
        {
            title: 'Created At',
            dataIndex: "createdAt",
            valueType: "date",
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Created At',
            dataIndex: "createdAt",
            valueType: "dateRange",
            hideInTable: true,
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
                                setOpenModalUpdate(true);
                                setDataUpdate(entity);
                            }}
                        />
                        <Popconfirm
                            placement="leftBottom"
                            title={"Delete User"}
                            description={"Are you sure to delete this user?"}
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => handleDeleteUser(entity._id)}
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
    // const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    //     // console.log(current, pageSize);
    //     setMeta({ ...meta, pageSize: pageSize, current: current });
    // };

    const actionRef = useRef<ActionType>();

    const refreshTable = () => {
        actionRef?.current?.reload();
    }

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    // console.log(params, sort, filter);
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}&sort=-createdAt`;
                        if (params.email) {
                            query += `&email=/${params.email}/i`;
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`;
                        }

                        const createdDateRange = dateRangeValidate(params.createdAtRange);
                        if (createdDateRange) {
                            query += `&createdAt>=${createdDateRange[0]}&createdAt<=${createdDateRange[1]}`;
                        }
                    }
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === 'ascend' ? "createdAt" : "-createdAt"}`;
                    } else {
                        query += `&sort=-createdAt`;
                    }
                    const res = await getUsersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCSVData(res.data.result);
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
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<ExportOutlined />}
                        type="primary"
                    >
                        <CSVLink filename='export-user.csv' data={csvData}>Export</CSVLink>
                    </Button>,
                    <Button
                        key="button"
                        icon={<CloudDownloadOutlined />}
                        onClick={() => {
                            setOpenModalImport(true);
                        }}
                        type="primary"
                    >
                        Import
                    </Button>,
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
            <ViewDetailUser setIsOpen={setIsOpen} dataDetail={dataDetail} isOpen={isOpen} setDataDetail={setDataDetail} />
            <FormAddUser setIsFormAddOpen={setIsFormAddOpen} isFormAddOpen={isFormAddOpen} refreshTable={refreshTable} />
            <ImportUser
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
                refreshTable={refreshTable}
            />
            <FormUpdateUser
                dataUpdate={dataUpdate}
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableUser;