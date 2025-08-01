import MobileFilter from '@/components/client/book/mobile.filter';
import { useCurrentApp } from '@/components/context/app.context';
import { getBooksAPI, getCategoryAPI } from '@/services/api';
import { FilterTwoTone, LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Spin } from 'antd';
import type { FormProps, GetProp } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import 'styles/home.scss';

type FieldType = {
    category: string[],
    from: number,
    to: number,
};



type SelectType = {
    value: string;
    label: string;
}


const HomePage = () => {

    const [form] = Form.useForm();

    const [searchTerm] = useOutletContext() as any;

    const navigate = useNavigate();

    const [categoryList, setCategoryList] = useState<SelectType[]>([]);

    const [bookList, setBookList] = useState<IBook[]>([]);

    const [filter, setFilter] = useState<string>("");

    const [sortQuery, setSortQuery] = useState<string>("sort=-sold");

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [total, setTotal] = useState<number>(0);

    const [current, setCurrent] = useState<number>(1);

    const [pageSize, setPageSize] = useState<number>(5);

    const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);


    const handleOnChangePage = (pagination: { page: number, pageSize: number }) => {
        if (pagination && pagination.page) {
            setCurrent(pagination.page);
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }

    }


    const handleChangeFilter = (changedValues: any, values: any) => {
        // console.log(">>> check handleChangeFilter", changedValues.category, values)
        let filter = "";
        if (changedValues && changedValues.category) {
            filter += `category=`;
            const data: string[] = changedValues.category;
            filter += `${data.join(',')}`;
            setFilter(filter);
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        // console.log(values.from);
        let filter = "";
        if (values) {
            if (values.from) {
                filter += `price>=${values.from}`;
            }

            if (values.to) {
                filter += `price<=${values.to}`;
            }
            setFilter(filter);
        }
    }

    useEffect(() => {
        const fetchCategoryList = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const data = res.data.map(it => ({
                    label: it,
                    value: it,
                }))
                setCategoryList(data);
            }
        }
        fetchCategoryList();
    }, []);

    const items = [
        {
            key: 'sort=-sold',
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: 'sort=-updatedAt',
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: 'sort=price',
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: 'sort=-price',
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ];


    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            let query = `current=${current}&pageSize=${pageSize}&sort=-sold`;
            if (filter) {
                query += `&${filter}`;
            }
            if (sortQuery) {
                query += `&${sortQuery}`;
            }

            if (searchTerm) {
                query += `&mainText=/${searchTerm}/i`;
            }

            const res = await getBooksAPI(query);
            if (res && res.data) {
                setTotal(res.data.meta.total)
                setBookList(res.data.result);
            }
            setIsLoading(false);
        }
        fetchBooks();
    }, [current, pageSize, sortQuery, filter, searchTerm]);

    return (
        <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
            <Row gutter={[20, 20]}>
                <Col md={4} sm={0} xs={0} style={{ border: "1px solid green" }}>
                    <div style={{ display: 'flex', justifyContent: "space-between" }}>
                        <span> <FilterTwoTone /> Bộ lọc tìm kiếm</span>
                        <ReloadOutlined title="Reset" onClick={() => form.resetFields()} />
                    </div>
                    <Form
                        onFinish={onFinish}
                        form={form}
                        onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                    >
                        <Form.Item<FieldType>
                            name="category"
                            label="Danh mục sản phẩm"
                            labelCol={{ span: 24 }}
                        >
                            <Checkbox.Group>
                                <Row>
                                    {categoryList.map(it => (
                                        <Col span={24}>
                                            <Checkbox value={it.value} >
                                                {it.label}
                                            </Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="Khoảng giá"
                            labelCol={{ span: 24 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                <Form.Item<FieldType>
                                    name="from"
                                >
                                    <InputNumber
                                        min={0}
                                        placeholder="đ TỪ"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                                <span >-</span>
                                <Form.Item<FieldType>
                                    name="to"
                                >
                                    <InputNumber
                                        min={0}
                                        placeholder="đ ĐẾN"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </div>
                            <div>
                                <Button onClick={() => form.submit()}
                                    style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                            </div>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="Đánh giá"
                            labelCol={{ span: 24 }}
                        >
                            <div>
                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text"></span>
                            </div>
                            <div>
                                <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text"> trở lên</span>
                            </div>
                            <div>
                                <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text"> trở lên</span>
                            </div>
                            <div>
                                <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text"> trở lên</span>
                            </div>
                            <div>
                                <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text"> trở lên</span>
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
                <Col md={20} xs={24} style={{ border: "1px solid red" }}>
                    <Spin indicator={<LoadingOutlined spin />} spinning={isLoading} size="large" >
                        <Row>
                            <Tabs
                                defaultActiveKey="sort=-sold"
                                items={items}
                                onChange={(value) => setSortQuery(value)}
                            />
                            <Col xs={24} md={0}>
                                <div style={{ marginBottom: 20 }}>
                                    <span onClick={() => setShowMobileFilter(true)}>
                                        <FilterTwoTone />
                                        <span style={{ fontWeight: 500 }}>Filter</span>
                                    </span>

                                </div>
                            </Col>
                        </Row>
                        <Row className='customize-row'>
                            {bookList.map(it => (
                                <div className="column" onClick={() => navigate(`/book/${it._id}`)}>
                                    <div className='wrapper'>
                                        <div className='thumbnail'>
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${it.thumbnail}`} alt="thumbnail book" />
                                        </div>
                                        <div className='text'>{it.mainText}</div>
                                        <div className='price'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(it.price)}
                                        </div>
                                        <div className='rating'>
                                            <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                            <span>Đã bán {it?.sold ?? 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </Row>
                    </Spin>
                    <Divider />
                    <Row style={{ display: "flex", justifyContent: "center" }}>
                        <Pagination
                            current={current}
                            total={total}
                            pageSize={pageSize}
                            // showSizeChanger
                            responsive
                            onChange={(p, s) => handleOnChangePage({ page: p, pageSize: s })}
                        />
                    </Row>
                </Col>
            </Row >
            <MobileFilter
                isOpen={showMobileFilter}
                setIsOpen={setShowMobileFilter}
                categoryList={categoryList}
                onFinish={onFinish}
                handleChangeFilter={handleChangeFilter}
            />
        </div >
    )
}

export default HomePage;