import { updatePaymentOrderAPI } from "@/services/api";
import { App, Button, Result, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ReturnURLPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const responseCode = searchParams?.get("vnp_ResponseCode") ?? "";
    const paymentRef = searchParams?.get("vnp_TxnRef") ?? "";
    const { notification } = App.useApp();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (paymentRef) {
            const updateOrder = async () => {
                setIsLoading(true);
                const res = await updatePaymentOrderAPI(responseCode === "00" ? "PAYMENT_SUCCEED" : "PAYMENT_FAILED", paymentRef);
                if (res && res.data) {

                } else {
                    notification.error({
                        message: "Error",
                        description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                        duration: 5,
                    })
                }

                setIsLoading(false);
            }

            updateOrder();
        }
    }, [paymentRef]);

    return (
        <>
            {isLoading ?
                <div style={{ padding: "50" }}>
                    <Skeleton active />
                </div>
                :
                <>
                    {responseCode === "00" ?
                        <Result
                            status="success"
                            title="Bought Successfully!"
                            subTitle="System has save your order already"
                            extra={[
                                <Button onClick={() => navigate('/')} type="primary" key="console">
                                    Home
                                </Button>,
                                <Button key="buy" onClick={() => navigate('/history')}>Order History</Button>,
                            ]}
                        /> :
                        <Result
                            status="error"
                            title="Failed"
                            subTitle="System has error occurred"
                            extra={[
                                <Button onClick={() => navigate('/')} type="primary" key="console">
                                    Home
                                </Button>,
                                <Button key="buy" onClick={() => navigate('/history')}>Order History</Button>,
                            ]}
                        />
                    }
                </>
            }
        </>
    );
};

export default ReturnURLPage;