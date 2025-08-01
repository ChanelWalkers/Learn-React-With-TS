import OrderDetail from "@/components/client/order";
import Payment from "@/components/client/order/payment";
import OrderResult from "@/components/client/order/result";
import { Steps } from "antd";
import { useState } from "react";

const OrderPage = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <div className="order-steps">
                    <Steps
                        size="small"
                        current={currentStep}
                        items={[
                            {
                                title: 'Đơn hàng',
                            },
                            {
                                title: 'Đặt hàng',
                            },
                            {
                                title: 'Thanh toán',
                            },
                        ]}
                    />
                </div>
                {currentStep === 0 &&
                    <OrderDetail setCurrentStep={setCurrentStep} />
                }
                {currentStep === 1 &&
                    <Payment setCurrentStep={setCurrentStep} />
                }
                {currentStep === 2 &&
                    <OrderResult />
                }
            </div>
        </div>
    )
}

export default OrderPage;