
import { App, Button, Col, Divider, Form, message, notification, Radio, Row, Space } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Input } from 'antd';
import { useCurrentApp } from '@/components/context/app.context';
import type { FormProps } from 'antd';
import { createOrderAPI, getVNPayUrlAPI } from '@/services/api';
import { v4 as uuidv4, v4 } from 'uuid';

const { TextArea } = Input;

type UserMethod = "COD" | "BANKING";

type FieldType = {
    fullName: string;
    phone: string;
    address: string;
    method: UserMethod;
};

interface IProps {
    setCurrentStep: (v: number) => void;
}
const Payment = (props: IProps) => {
    const { carts, setCarts, user } = useCurrentApp();

    const { setCurrentStep } = props;

    const [totalPrice, setTotalPrice] = useState(0);

    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const [form] = Form.useForm();

    // const [isSubmit, setIsSubmit] = useState(false);
    // const { message, notification } = App.useApp();
    // const { setCurrentStep } = props;

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                phone: user.phone,
                method: "COD"
            })
        }
    }, [user])

    useEffect(() => {
        if (carts && carts.length > 0) {
            const price = carts.map(it => (
                it.quantity * (it.detail?.price ?? 0)
            ));
            const total = price.reduce((acc, cur) => (acc + cur));
            setTotalPrice(total);
        } else {
            setTotalPrice(0);
        }
    }, [carts]);


    const handleRemoveBook = (_id: string) => {
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage) {
            //update
            const carts = JSON.parse(cartStorage) as ICart[];
            const newCarts = carts.filter(item => item._id !== _id)
            localStorage.setItem("carts", JSON.stringify(newCarts));
            //sync React Context
            setCarts(newCarts);
        }
    }

    const handlePlaceOrder: FormProps<FieldType>['onFinish'] = async (values) => {
        // console.log(values)
        setIsSubmit(true);
        let res = null;
        let detail: any;
        if (carts && carts.length > 0) {
            detail = carts.map(it => ({
                _id: it._id,
                bookName: it.detail?.mainText,
                quantity: it.quantity,
            }))
        }
        const paymentRef = v4();
        const data: ICreateOrder = {
            name: values.fullName,
            address: values.address,
            phone: values.phone,
            totalPrice: totalPrice,
            type: values.method,
            detail: detail
        };
        if (values.method === "COD") {
            res = await createOrderAPI(data);
        } else {
            const newData = { ...data, paymentRef: paymentRef };
            res = await createOrderAPI(newData);
        }
        if (res && res.data) {
            setCarts([]);
            localStorage.setItem('carts', JSON.stringify([]));
            if (values.method === "COD") {
                setCurrentStep(2);
                message.success("Buy Successfully!")
            } else {
                const vnPayUrl = await getVNPayUrlAPI(totalPrice, "vn", paymentRef);
                console.log(vnPayUrl);
                if (vnPayUrl.data) {
                    window.location.href = vnPayUrl.data.url;
                } else {
                    notification.error({
                        message: "Error",
                        description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                        duration: 5,
                    })
                }
            }
        } else {
            notification.error({
                message: "Error",
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5,
            })
        }
        setIsSubmit(false);
    }


    return (
        <Row gutter={[20, 20]}>
            <Col md={16} xs={24}>
                {carts?.map((book, index) => {
                    const currentBookPrice = book?.detail?.price ?? 0;
                    return (
                        <div className='order-book' key={`index-${index}`}>
                            <div className='book-content'>
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                                <div className='title'>
                                    {book?.detail?.mainText}
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice)}
                                </div>
                            </div>
                            <div className='action'>
                                <div className='quantity'>
                                    Số lượng: {book?.quantity}
                                </div>
                                <div className='sum'>
                                    Tổng:  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice * (book?.quantity ?? 0))}
                                </div>
                                <DeleteTwoTone
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleRemoveBook(book?._id ?? "")}
                                    twoToneColor="#eb2f96"
                                />

                            </div>
                        </div>
                    )
                })}
                <div><span
                    style={{ cursor: "pointer" }}
                    onClick={() => props.setCurrentStep(0)}>
                    Quay trở lại
                </span>
                </div>
            </Col>
            <Col md={8} xs={24} >
                <Form
                    form={form}
                    name="payment-form"
                    onFinish={handlePlaceOrder}
                    autoComplete="off"
                    layout='vertical'
                >
                    <div className='order-sum'>
                        <Form.Item<FieldType>
                            label="Hình thức thanh toán"
                            name="method"
                        >
                            <Radio.Group>
                                <Space direction="vertical">
                                    <Radio value={"COD"}>Thanh toán khi nhận hàng</Radio>
                                    <Radio value={"BANKING"}>Thanh toan VNPAY</Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Họ tên"
                            name="fullName"
                            rules={[
                                { required: true, message: 'Họ tên không được để trống!' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                { required: true, message: 'Số điện thoại không được để trống!' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Địa chỉ nhận hàng"
                            name="address"
                            rules={[
                                { required: true, message: 'Địa chỉ không được để trống!' },
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>

                        <div className='calculate'>
                            <span>  Tạm tính</span>
                            <span>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                            </span>
                        </div>
                        <Divider style={{ margin: "10px 0" }} />
                        <div className='calculate'>
                            <span> Tổng tiền</span>
                            <span className='sum-final'>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                            </span>
                        </div>
                        <Divider style={{ margin: "10px 0" }} />
                        {/* <button type="submit">Đặt Hàng ({carts?.length ?? 0})</button> */}
                        <Button color="danger" loading={isSubmit} onClick={() => form.submit()} variant="solid">
                            Đặt Hàng ({carts?.length ?? 0})
                        </Button>
                    </div>
                </Form>

            </Col>
        </Row>
    )
}

export default Payment;