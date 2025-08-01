import { useCurrentApp } from "@/components/context/app.context";
import { App, Button, Col, Form, Input, Row } from "antd";
import { useEffect, useState } from "react";
import type { FormProps } from 'antd';
import { changePasswordAPI } from "@/services/api";

type FieldType = {
    email: string;
    oldpass: string;
    newpass: string;
};

const ChangePassword = () => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const { user } = useCurrentApp();
    const { message, notification } = App.useApp();

    useEffect(() => {
        if (user) {
            form.setFieldValue("email", user.email)
        }
    }, [user]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const data: IChangePassword = {
            email: values.email,
            oldpass: values.oldpass,
            newpass: values.newpass,
        }
        const res = await changePasswordAPI(data);
        if (res && res.data) {
            message.success("Change password successfully!");
            form.setFieldsValue({
                oldpass: "",
                newpass: "",
            })
        } else {
            notification.error({
                message: 'Failed',
                description: res.message,
            })
        }
        setIsSubmit(false);
    };


    return (
        <div style={{ minHeight: 400 }}>
            <Row>
                <Col span={1}></Col>
                <Col span={12}>
                    <Form
                        name="change-password"
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }} //whole column
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Email không được để trống!' }]}
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }} //whole column
                            label="Mật khẩu hiện tại"
                            name="oldpass"
                            rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }} //whole column
                            label="Mật khẩu mới"
                            name="newpass"
                            rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                        >
                            <Input.Password />
                        </Form.Item>


                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmit}
                            >
                                Xác nhận
                            </Button>
                        </Form.Item>

                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default ChangePassword;