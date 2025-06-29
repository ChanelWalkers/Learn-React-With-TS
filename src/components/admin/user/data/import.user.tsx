import { App, Modal, Table } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { Buffer } from "buffer";
import { useState } from "react";

import Exceljs from 'exceljs';
import { createListUsersAPI } from "@/services/api";
import templateFile from 'assets/template/template.xlsx?url';
const { Dragger } = Upload;

interface IDataImport extends ICreateUser {
}

interface IProps {
    openModalImport: boolean;
    setOpenModalImport: (v: boolean) => void;
    refreshTable: () => void;
}

const ImportUser = (props: IProps) => {
    const { setOpenModalImport, openModalImport, refreshTable } = props;
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const { message, notification } = App.useApp();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,

        // https://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        // https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it
        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 1000);
        },

        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    const workbook = new Exceljs.Workbook();
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    await workbook.xlsx.load(buffer);

                    // const excel = require('exceljs');
                    // const workbook = new excel.Workbook();
                    // use readFile for testing purpose
                    // await workbook.xlsx.load(objDescExcel.buffer);
                    // await workbook.xlsx.readFile(process.argv[2]);
                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        // read first row as data keys
                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;
                        let keys = firstRow.values as any[];
                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            let values = row.values as any;
                            let obj = {} as any;
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        })
                    });
                    setDataImport(jsonData);
                    jsonData.map((item, index) => {
                        return { ...item, id: index + 1 };
                    })
                    // console.log(jsonData);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
            console.log(info.file.url);
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleReset = () => {
        setDataImport([]);
        setOpenModalImport(false);
    }

    const handleImportData = async () => {
        setIsSubmit(true);
        const res = await createListUsersAPI(dataImport);
        if (res.data) {
            notification.success({
                message: "Bulk Create",
                description: `Success: ${res.data?.countSuccess}, Error: ${res.data.countError}`
            })
        }
        setIsSubmit(false);
        refreshTable();
        handleReset();
    }

    return (
        <>
            <Modal title="Import data user"
                width={"50vw"}
                open={openModalImport}
                onOk={handleImportData}
                onCancel={() => handleReset()}
                onClose={() => handleReset()}
                okText="Import data"
                okButtonProps={{
                    disabled: dataImport.length > 0 ? false : true,
                    loading: isSubmit
                }}
                //do not close when click outside
                maskClosable={false}
            >
                <Dragger {...propsUpload} >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xls, .xlsx
                        Or <a href=""
                            download={true}
                            onClick={(e) => e.stopPropagation()}
                        >Download Sample File</a>
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        rowKey={"id"}
                        dataSource={dataImport}
                        title={() => <span>Dữ liệu upload:</span>}
                        columns={[
                            { dataIndex: 'fullName', title: 'Tên hiển thị' },
                            { dataIndex: 'email', title: 'Email' },
                            { dataIndex: 'phone', title: 'Số điện thoại' },
                        ]}
                    />
                </div>
            </Modal>
        </>
    )
}

export default ImportUser;