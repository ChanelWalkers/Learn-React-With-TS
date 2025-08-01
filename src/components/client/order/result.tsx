import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom';


const OrderResult = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="success"
            title="Ordered Successfully!"
            subTitle="System has save your order already"
            extra={[
                <Button onClick={() => navigate('/')} type="primary" key="console">
                    Home
                </Button>,
                <Button key="buy" onClick={() => navigate('/history')}>Order History</Button>,
            ]}
        />
    );
}

export default OrderResult;