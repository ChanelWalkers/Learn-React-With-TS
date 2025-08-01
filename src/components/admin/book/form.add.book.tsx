import { callUploadFileImgAPI, createBookAPI, getCategoryAPI } from '@/services/api';
import { App, Button, Col, Divider, Form, Image, Input, InputNumber, Modal, Row, Select, Upload } from 'antd';
import { useEffect, useState } from 'react';
import type { GetProp, UploadFile } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadProps, UploadRequestOption as RcCustomRequestOptions, UploadRequestOption } from 'rc-upload/lib/interface';

interface IProps {
    isFormAddOpen: boolean;
    setIsFormAddOpen: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = ICreateBook;


type SelectType = {
    value: string;
    label: string;
}

interface CommonFileType {
    name: string;
    status: string;
    uid: string;
    url: string;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const normFile = (e: any) => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};



const FormAddBook = (props: IProps) => {
    const { isFormAddOpen, setIsFormAddOpen, refreshTable } = props;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

    const [fileListSlider, setFileListSlider] = useState<CommonFileType[]>([]);
    const [fileListThumbnail, setFileListThumbnail] = useState<CommonFileType[]>([]);

    const [form] = Form.useForm();

    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const [categoryList, setCategoryList] = useState<SelectType[]>([]);

    const handleClose = () => {
        setIsFormAddOpen(false);
        setFileListSlider([]);
        setFileListThumbnail([]);
        form.resetFields();
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const thumbnailImgName = fileListThumbnail.map(it => it.name)[0];
        const sliderImgName = fileListSlider.map(it => it.name);
        console.log(values)
        const data = {
            thumbnail: thumbnailImgName,
            mainText: values.mainText,
            author: values.author,
            quantity: values.quantity,
            category: values.category,
            slider: sliderImgName,
            price: values.price,
        };
        const res = await createBookAPI(data);
        if (res && res.data) {
            notification.success({
                message: 'Successfully!',
                description: "Create Book Successfully",
            })
            refreshTable();
        } else {
            message.error('Create Book Failed');
        }
        handleClose();
        setIsSubmit(false);
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    const { message, notification } = App.useApp();

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
    };

    // const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    //     setFileList(newFileList);


    useEffect(() => {
        const fetchCategoryList = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const data = res.data.map(item => (
                    { label: item, value: item }
                ));
                setCategoryList(data);
            }
        }
        fetchCategoryList();
    }, [])


    const handleUploadFile = async (options: UploadRequestOption, type: "slider" | "thumbnail") => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await callUploadFileImgAPI(file, "book");
        if (res && res.data) {
            const uploadedFile: CommonFileType = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: "done",
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
            }
            if (type === 'slider') {
                setFileListSlider((prevItem) => [...prevItem, { ...uploadedFile }]);
            } else {
                setFileListThumbnail([{ ...uploadedFile }]);
            }
            if (onSuccess) {
                onSuccess("ok");
            }
        } else {
            message.error(res.message);
        }

    }

    const handleRemove = (file: UploadFile, type: 'slider' | 'thumbnail') => {
        if (type === 'thumbnail') {
            setFileListThumbnail([]);
        } else {
            setFileListSlider(slider => slider.filter(it => it.uid !== file.uid));
        }
    }

    const handleChange = (info: UploadChangeParam, type: 'slider' | 'thumbnail') => {

        if (info.file.status === 'uploading') {
            type === 'slider' ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return;
        }
        if (info.file.status === 'done') {
            type === 'slider' ? setLoadingSlider(false) : setLoadingThumbnail(false);
        }
    };

    return (
        <>
            <Modal
                title="Basic Modal"
                closable={{ 'aria-label': 'Custom Close Button' }}
                okText="Create Book"
                maskClosable={false}
                onOk={() => form.submit()}
                onCancel={handleClose}
                onClose={handleClose}
                open={isFormAddOpen}
                confirmLoading={isSubmit}
                width={"50vw"}
            >
                <Divider />
                <Form
                    name="form-register"
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Book name"
                                name="mainText"
                                rules={[{ required: true, message: 'Please input book name' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Author"
                                name="author"
                                rules={[{ required: true, message: 'Please input author' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Price"
                                name="price"
                                rules={[{ required: true, message: 'Please input price' }]}
                            >
                                <InputNumber
                                    addonAfter={"đ"}
                                    formatter={(value) => {
                                        return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    }}
                                    min={0}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Category"
                                name="category"
                                rules={[{ required: true, message: 'Please input category' }]}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    options={categoryList}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Quantity"
                                name="quantity"
                                rules={[{ required: true, message: 'Please input quantity' }]}
                            >
                                <InputNumber min={1} width={"100%"} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Thumbnail"
                                name="thumbnail"
                                rules={[{ required: true, message: 'Please input quantity' }]}
                                valuePropName='fileList'
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    onPreview={handlePreview}
                                    customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                    multiple={false}
                                    maxCount={1}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'thumbnail')}
                                    onRemove={(file) => handleRemove(file, 'thumbnail')}
                                >
                                    <div>
                                        {loadingThumbnail ? <LoadingOutlined /> : uploadButton}
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Slider"
                                name="slider"
                                rules={[{ required: true, message: 'Please input thumbnail' }]}
                                valuePropName='fileList'
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    onPreview={handlePreview}
                                    customRequest={(options) => handleUploadFile(options, 'slider')}
                                    multiple
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onRemove={(file) => handleRemove(file, 'slider')}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : uploadButton}
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Modal>
        </>
    )
}

export default FormAddBook;