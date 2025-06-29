import { FORMATE_DATE_VN } from "@/services/helper";
import { Drawer, Avatar } from "antd";

import { Badge, Descriptions } from 'antd';
import dayjs from "dayjs";


interface IProps {
    setIsOpen: (v: boolean) => void;
    isOpen: boolean;
    dataDetail: IUserTable | null;
    setDataDetail: (v: IUserTable | null) => void;
}

const ViewDetailUser = (props: IProps) => {
    const { setIsOpen, isOpen, dataDetail, setDataDetail } = props;

    const onClose = () => {
        setIsOpen(false);
        setDataDetail(null);
    }

    return (
        <Drawer
            title="User Information"
            closable={{ 'aria-label': 'Close Button' }}
            onClose={onClose}
            maskClosable={true}
            open={isOpen}
            width={"55vw"}
        >
            <Descriptions title="User Information" column={2} bordered>
                <Descriptions.Item label="Id">{dataDetail?._id}</Descriptions.Item>
                <Descriptions.Item label="FullName">{dataDetail?.fullName}</Descriptions.Item>
                <Descriptions.Item label="Email">{dataDetail?.email}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{dataDetail?.phone}</Descriptions.Item>
                <Descriptions.Item label="Role">
                    <Badge status="processing" text={dataDetail?.role} />
                </Descriptions.Item>
                <Descriptions.Item label="Avatar">
                    <Avatar size={40} src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataDetail?.avatar}`}>USER</Avatar>
                </Descriptions.Item>
                <Descriptions.Item label="Created At">{dayjs(dataDetail?.createdAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
                <Descriptions.Item label="Updated At">{dayjs(dataDetail?.updatedAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
}

export default ViewDetailUser;