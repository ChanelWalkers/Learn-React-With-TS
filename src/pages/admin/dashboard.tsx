import { dashBoardAPI } from '@/services/api';
import type { StatisticProps } from 'antd';
import { Card, Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator="," />
);

const DashBoardPage = () => {
    const [value, setValue] = useState<IStatistic>();

    useEffect(() => {
        const fetchDashboard = async () => {
            const res = await dashBoardAPI();
            if (res && res.data) {
                setValue(res.data);
            }
        };

        fetchDashboard();
    }, []);

    return (
        <Row gutter={16}>
            <Col span={8}>
                <Card>
                    <Statistic title="Total Users" value={value?.countUser} formatter={formatter} />
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                    <Statistic title="Total Orders" value={value?.countOrder} formatter={formatter} />
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                    <Statistic title="Total Books" value={value?.countBook} formatter={formatter} />
                </Card>
            </Col>
        </Row>
    )
}

export default DashBoardPage;
