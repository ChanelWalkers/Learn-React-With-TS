import { createUserAPI } from "@/services/api";
import { App, Modal, Form, Input } from "antd";
import type { FormProps } from 'antd';
import { useState } from "react";

interface IProps {
    setIsFormAddOpen: (v: boolean) => void;
    isFormAddOpen: boolean;
    refreshTable: () => void;
}

type FieldType = ICreateUser;


const FormAddUser = (props: IProps) => {
    const { notification, message } = App.useApp();

    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const [form] = Form.useForm();

    const { isFormAddOpen, setIsFormAddOpen, refreshTable } = props;

    const onClose = () => {
        handleReset();
    }

    const handleReset = () => {
        setIsFormAddOpen(false);
        form.resetFields();
    }


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { email, phone, password, fullName } = values;
        // setIsSubmit(true);
        const data = {
            email: email,
            phone: phone,
            password: password,
            fullName: fullName,
        }
        const res = await createUserAPI(data);
        if (res && res.data) {
            message.success('Create User successfully!');
            handleReset();
            refreshTable();
        } else {
            notification.error({
                message: "Failed",
                description: res.message,
            })
        }
        setIsSubmit(false);
    };

    return (
        <Modal
            title="Create User"
            closable={{ 'aria-label': 'Custom Close Button' }}
            okText="Create User"
            onClose={() => onClose()}
            onCancel={onClose}
            maskClosable={true}
            open={isFormAddOpen}
            onOk={() => form.submit()}
            confirmLoading={isSubmit}
        >
            <Form
                name="form-register"
                onFinish={onFinish}
                autoComplete="off"
                form={form}
            >
                <Form.Item<FieldType>
                    labelCol={{ span: 24 }} //whole column
                    label="Họ tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                >
                    <Input />
                </Form.Item>


                <Form.Item<FieldType>
                    labelCol={{ span: 24 }} //whole column
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Email không được để trống!' },
                        { type: "email", message: "Email không đúng định dạng!" }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    labelCol={{ span: 24 }} //whole column
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item<FieldType>
                    labelCol={{ span: 24 }} //whole column
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                >
                    <Input />
                </Form.Item>


            </Form>
        </Modal>
    )
}

export default FormAddUser;