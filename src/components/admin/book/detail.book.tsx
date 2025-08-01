import { FORMATE_DATE_VN } from "@/services/helper";
import { Divider, Drawer } from "antd";
import { Badge, Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';
import { Image, Upload } from 'antd';
import { useEffect, useState } from "react";
import type { GetProp, UploadFile, UploadProps } from 'antd';
import dayjs from "dayjs";
import { v4 } from "uuid";

interface IProps {
    isOpenViewDetail: boolean;
    setIsOpenViewDetail: (v: boolean) => void;
    dataDetail: IBook | null;
    setDataDetail: (v: IBook | null) => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const DetailBook = (props: IProps) => {
    const { isOpenViewDetail, setIsOpenViewDetail, dataDetail, setDataDetail } = props;

    const onClose = () => {
        setIsOpenViewDetail(false);
        setDataDetail(null);
    }

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Id',
            children: dataDetail?._id
        },
        {
            key: '2',
            label: 'Book name',
            children: dataDetail?.mainText
        },
        {
            key: '3',
            label: 'Author',
            children: dataDetail?.author
        },
        {
            key: '4',
            label: 'Price',
            children: `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataDetail?.price ?? 0)}`
        },
        {
            key: '6',
            label: 'Category',
            children: <Badge status="processing" text={dataDetail?.category} />,
            span: 2,
        },
        {
            key: '7',
            label: 'Created at',
            children: <p>{dayjs(dataDetail?.createdAt).format(FORMATE_DATE_VN)}</p>,
        },
        {
            key: '8',
            label: 'Updated At',
            children: <p>{dayjs(dataDetail?.updatedAt).format(FORMATE_DATE_VN)}</p>,
        },
    ];

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');


    useEffect(() => {
        if (!dataDetail)
            return;
        const images = [
            ...(dataDetail?.slider ?? []),
            dataDetail.thumbnail
        ].filter(Boolean);

        const files: UploadFile[] = images.map(name => ({
            uid: v4(),
            name,
            status: 'done',
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${name}`,
        }));
        setFileList(files);
    }, [dataDetail]);

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);


    return (
        <Drawer
            title="View detail Book"
            closable={{ 'aria-label': 'Close Button' }}
            onClose={onClose}
            maskClosable={true}
            open={isOpenViewDetail}
            width={"55vw"}
        >
            <Descriptions title="Book Info" bordered column={2} items={items} />
            <Divider orientation="left">Book Images</Divider>
            <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                showUploadList={
                    { showRemoveIcon: false }
                }
            >
            </Upload>
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
        </Drawer>
    );
}

export default DetailBook;