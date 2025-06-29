import { Modal, Form, Input, App } from "antd";
import { useEffect, useState } from "react";
import type { FormProps } from 'antd';
import { updateUserAPI } from "@/services/api";

type FieldType = {
    fullName: string;
    email: string;
    phone: string;
    _id: string;
};

interface IProps {
    dataUpdate: IUserTable | null;
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
}

const FormUpdateUser = (props: IProps) => {
    const { dataUpdate, refreshTable, setOpenModalUpdate, openModalUpdate } = props;

    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    const onClose = () => {
        setOpenModalUpdate(false);
        form.resetFields();
    }



    const handleReset = () => {
        setOpenModalUpdate(false);
        form.resetFields();
    }

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                email: dataUpdate.email,
                _id: dataUpdate._id,
                phone: dataUpdate.phone,
                fullName: dataUpdate.fullName
            })
        }
    }, [dataUpdate])

    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { phone, _id, fullName } = values;
        const res = await updateUserAPI(fullName, phone, _id);
        if (res.data) {
            message.success("Update User successfully!");
            handleReset();
            refreshTable();
        } else {
            notification.error({
                message: "Update Failed",
                description: res.message,
            })
        }
        setIsSubmit(false);
    };

    return (
        <Modal
            title="Update User"
            closable={{ 'aria-label': 'Custom Close Button' }}
            okText="Save"
            onClose={() => onClose()}
            onCancel={onClose}
            maskClosable={true}
            open={openModalUpdate}
            onOk={() => form.submit()}
            okButtonProps={{
                loading: isSubmit,
            }}
        >
            <Form
                name="form-register"
                onFinish={onFinish}
                autoComplete="off"
                form={form}
            >


                <Form.Item<FieldType>
                    labelCol={{ span: 24 }} //whole column
                    label="Id"
                    name="_id"
                    hidden
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item<FieldType>
                    labelCol={{ span: 24 }} //whole column
                    label="Email"
                    name="email"
                    required
                >
                    <Input disabled />
                </Form.Item>

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

export default FormUpdateUser;