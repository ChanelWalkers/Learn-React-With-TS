import { getOrderHistoryAPI } from '@/services/api';
import { FORMATE_DATE_VN } from '@/services/helper';
import { Divider, Drawer, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';


const OrderHistory = () => {
    const columns: TableProps<IHistory>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'name',
            key: 'name',
            render: (_v, _, index) => (
                <a href="">{index + 1}</a>
            ),
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            render(value, record, index) {
                return (
                    <>{dayjs(record.createdAt).format(FORMATE_DATE_VN)}</>
                );
            },
        },
        {
            title: 'Total',
            dataIndex: 'totalPrice',
            key: 'total',
            render: (value, record, _) => (
                <>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice)}
                </>
            )
        },
        {
            title: 'paymentRef',
            dataIndex: 'paymentRef'
        },
        {
            title: 'Status',
            key: 'paymentStatus',
            dataIndex: 'paymentStatus',
            render: (_, record, _v) => (
                <>
                    <Tag color={record.paymentStatus === "UNPAID" ? "volcano" : "success"} key={_v}>
                        {record.paymentStatus}
                    </Tag>
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => {
                        setOpenDetail(true);
                        setDataDetail(record);
                    }}>Xem chi tiet</a>
                </Space>
            ),
        },
    ];

    const [data, setData] = useState<IHistory[]>([]);

    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const [dataDetail, setDataDetail] = useState<IHistory | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            const res = await getOrderHistoryAPI();
            if (res && res.data) {
                setData(res.data);
            }
            setIsLoading(false);
        }

        fetchHistory();
    }, []);

    return (
        <div style={{
            margin: '50px'
        }}>
            <h3>Lịch sử mua hàng</h3>
            <Divider />
            <Table<IHistory> loading={isLoading} columns={columns} dataSource={data} />
            <Drawer
                title="Chi tiết đơn hàng"
                onClose={() => {
                    setOpenDetail(false);
                    setDataDetail(null);
                }}
                open={openDetail}
            >
                {dataDetail?.detail?.map((item, index) => {
                    return (
                        <ul key={index}>
                            <li>
                                Tên sách: {item.bookName}
                            </li>
                            <li>
                                Số lượng: {item.quantity}
                            </li>
                            <Divider />
                        </ul>
                    )
                })}
            </Drawer>
        </div>
    )
}

export default OrderHistory;