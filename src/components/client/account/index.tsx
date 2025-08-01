import { useCurrentApp } from "@/components/context/app.context";
import { Modal } from "antd";
import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import UserInfo from "./user.info";
import ChangePassword from "./change.password";

interface IProps {
    showModalUpdateAccount: boolean;
    setShowModalUpdateAccount: (v: boolean) => void
}

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Update Information',
        children: <UserInfo />,
    },
    {
        key: '2',
        label: 'Change Password',
        children: <ChangePassword />,
    },
];

const onChange = (key: string) => {
    console.log(key);
};

const Account = (props: IProps) => {
    const { showModalUpdateAccount, setShowModalUpdateAccount } = props;

    return (
        <div>
            <Modal
                title="Account Management"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={showModalUpdateAccount}
                onCancel={() => setShowModalUpdateAccount(false)}
                maskClosable={false}
                footer={
                    <></>
                }
            >
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </Modal>
        </div>
    )
}

export default Account;