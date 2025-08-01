import { useCurrentApp } from "@/components/context/app.context";
import { callUploadFileImgAPI, updateUserInforAPI } from "@/services/api";
import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Avatar, Button, Col, Form, FormProps, Input, Row, Upload } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { UploadFile } from "antd/lib";
import { UploadRequestOption as RcCustomRequestOptions, UploadRequestOption } from 'rc-upload/lib/interface';
import { useEffect, useState } from "react";

type FieldType = {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
}

const UserInfo = () => {
    const { user, setUser } = useCurrentApp();

    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");
    const [isSubmit, setIsSubmit] = useState(false);


    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userAvatar}`;

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                _id: user.id
            });
        }
    }, [user]);

    const handleUploadFile = async (options: UploadRequestOption) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await callUploadFileImgAPI(file, "avatar");
        if (res && res.data) {
            setUserAvatar(res.data.fileUploaded);
            if (onSuccess) {
                onSuccess("ok");
            }
        } else {
            message.error(res.message);
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const data: IUpdateInfor = {
            _id: values._id,
            phone: values.phone,
            avatar: userAvatar,
            fullName: values.fullName,
        }
        const res = await updateUserInforAPI(data);
        if (res && res.data) {
            message.success("Change information successfully!");
            form.setFieldsValue({
                fullName: "",
                phone: "",
            });
            setUserAvatar("");
            localStorage.removeItem("access_token");
        } else {
            notification.error({
                message: 'Failed',
                description: res.message,
            })
        }
        setIsSubmit(false);
    };



    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadFile,
        onChange(info: UploadChangeParam) {
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
                message.success(`Upload file thành công`);
            } else if (info.file.status === 'error') {
                message.error(`Upload file thất bại`);
            }
        },
    };

    return (
        <div style={{
            display: 'flex',
            margin: '0 auto',
            gap: '55px',
            minHeight: '50vh',
            alignItems: 'center'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                justifyContent: 'center'
            }}>
                <div>
                    <Avatar
                        size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200 }}
                        icon={<AntDesignOutlined />}
                        src={urlAvatar}
                        shape="circle"
                    />
                </div>
                <div>
                    <Upload {...propsUpload}>
                        <Button icon={<UploadOutlined />}>
                            Upload Avatar
                        </Button>
                    </Upload>
                </div>
            </div>

            <Form
                name="user-info"
                autoComplete="off"
                form={form}
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    label="ID"
                    name="_id"
                    hidden
                >
                </Form.Item>
                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[{ required: true }]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: 'Please input your full name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please input your full name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label={null}>
                    <Button type="primary" onClick={() => form.submit()}>
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UserInfo