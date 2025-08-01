import { useCurrentApp } from '@/components/context/app.context';
import { DeleteTwoTone } from '@ant-design/icons';
import { App, Col, Divider, Empty, InputNumber, Row } from 'antd';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import 'styles/order.scss'

type TProps = {
    setCurrentStep: (v: number) => void;
}

const OrderDetail = (props: TProps) => {
    const { setCurrentStep } = props;

    const { carts, setCarts } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const { message } = App.useApp();

    const handleRemoveBook = (id: string) => {
        const cartStorage = localStorage.getItem('carts');
        if (cartStorage) {
            const data: ICart[] = JSON.parse(cartStorage);
            const newArr = data.filter(it => it._id !== id);
            setCarts(newArr);
            localStorage.setItem('carts', JSON.stringify(newArr));
        }
    }

    const handleNextStep = () => {
        if (!carts.length) {
            message.error("Không tồn tại sản phẩm trong giỏ hàng.")
            return;
        }
        setCurrentStep(1);
    }

    const handleOnChangeInput = (value: number, detail: IBook | null) => {
        if (!value || +value < 1) {
            return;
        }

        if (!isNaN(value)) {
            const cartStorage = localStorage.getItem('carts');
            if (cartStorage) {
                const data = JSON.parse(cartStorage) as ICart[];
                const indexFound = data.findIndex(c => c._id === detail?._id);
                if (indexFound !== -1) {
                    data[indexFound].quantity = value;
                    setCarts(data);
                    localStorage.setItem('carts', JSON.stringify(data));
                }
            }
        }
    }

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
    }, [carts])

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto', overflow: 'hidden' }}>
                <Row gutter={[20, 20]}>
                    <Col md={18} xs={24}>
                        {carts.length ?
                            carts?.map((item, index) => {
                                const currentBookPrice = item?.detail?.price ?? 0;
                                return (
                                    <div className='order-book' key={`index-${index}`} style={isMobile ? { flexDirection: 'column' } : {}}>
                                        <div className='book-content'>
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`} />
                                            <div className='title'>
                                                {item?.detail?.mainText}
                                            </div>
                                            <div className='price'>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice)}
                                            </div>
                                        </div>
                                        <div className='action'>
                                            <div className='quantity'>
                                                <InputNumber
                                                    onChange={(value) => handleOnChangeInput(value as number, item.detail)}
                                                    value={item.quantity}
                                                />
                                            </div>
                                            <div className='sum'>
                                                Tổng:  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice * (item?.quantity ?? 0))}
                                            </div>
                                            <DeleteTwoTone
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleRemoveBook(item?._id ?? "")}
                                                twoToneColor="#eb2f96"
                                            />

                                        </div>
                                    </div>
                                )
                            }) :
                            <Empty
                                description="Không có sản phẩm trong giỏ hàng"
                            />
                        }
                    </Col>
                    <Col md={6} xs={24} >
                        <div className='order-sum'>
                            <div className='calculate'>
                                <span> Tạm tính</span>
                                <span>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                                </span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <div className='calculate'>
                                <span>Tổng tiền</span>
                                <span className='sum-final'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                                </span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <button onClick={() => handleNextStep()}>Mua Hàng ({carts?.length ?? 0})</button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default OrderDetail;