import { Button, Checkbox, Col, Divider, Drawer, Form, InputNumber, Rate, Row } from "antd";

interface IProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    categoryList: { value: string, label: string }[];
    onFinish: any;
    handleChangeFilter: (v: any, val: any) => void;
}

const MobileFilter = (props: IProps) => {
    const { onFinish, isOpen, setIsOpen, categoryList, handleChangeFilter } = props;

    const [form] = Form.useForm();
    return (
        <Drawer open={isOpen}
            placement="right"
            title={"FilterProduct"}
            onClose={() => setIsOpen(false)}
        >
            <Form
                onFinish={onFinish}
                form={form}
                onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
            >
                <Form.Item
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
                        <Form.Item
                            name="from"
                        >
                            <InputNumber
                                min={0}
                                placeholder="đ TỪ"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>
                        <span >-</span>
                        <Form.Item
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
        </Drawer>
    );
}

export default MobileFilter;