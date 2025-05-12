import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Space, Tag, message, Popconfirm, Form, Input } from 'antd';
import { getDirectors, createDirector, putDirector, deleteDirector } from '../api/api';
import {DirectorDto, getFullName} from "../types/models";

const DirectorsPage: React.FC = () => {
    const [directors, setDirectors] = useState<DirectorDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDirector, setEditingDirector] = useState<DirectorDto | null>(null);
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false); // Новое состояние

    useEffect(() => {
        fetchDirectors();
    }, []);

    const fetchDirectors = async () => {
        setLoading(true);
        try {
            const data = await getDirectors();
            setDirectors(data);
        } catch (error) {
            message.error('Failed to fetch directors');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const values = await form.validateFields();
            const directorDto: DirectorDto = {
                ...(editingDirector || {}),
                ...values
            };

            if (editingDirector) {
                await putDirector(directorDto);

                message.success('Director puted successfully');
            } else {
                await createDirector(directorDto);
                message.success('Director created successfully');
            }
            handleModalClose();
            // setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 300));
            fetchDirectors();
        } catch (error) {
            message.error(error instanceof Error ? error.message : 'Error saving director');
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteDirector(id);
            message.success('Director deleted successfully');
            fetchDirectors();
        } catch (error) {
            message.error('Error deleting director');
        }
    };

    const handleModalClose = () => {
        form.resetFields();
        setEditingDirector(null);
        setIsModalVisible(false);
    };

    const handleEditClick = (record: DirectorDto) => {
        form.setFieldsValue(record);
        setEditingDirector(record);
        setIsModalVisible(true);
    };

    const handleAddClick = () => {
        form.resetFields();
        setEditingDirector(null);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: '№',
            key: 'index',
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Second Name',
            dataIndex: 'secondName',
            key: 'secondName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Films',
            dataIndex: 'films',
            key: 'films',
            render: (films: any[]) => (
                <>
                    {films?.map(film => (
                        <Tag key={film.id}>
                            {film.title} ({film.year})
                        </Tag>
                    ))}
                </>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: DirectorDto) => (
                <Space size="middle">
                    <Button onClick={() => handleEditClick(record)}>Edit</Button>
                    <Popconfirm
                        title="Are you sure to delete this director?"
                        onConfirm={() => handleDelete(record.id!)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button
                type="primary"
                onClick={handleAddClick}
                style={{ marginBottom: 16 }}
            >
                Add Director
            </Button>

            <Table
                className={loading ? 'table-loading' : 'table-update'}
                columns={columns}
                dataSource={directors}
                rowKey="id"
                loading={loading}
                bordered
                pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                    position: ['bottomCenter'] // Размещаем пагинацию по центру
                }}
            />

            <Modal
                title={editingDirector ? 'Edit Director' : 'Add Director'}
                className="modal-fade"
                visible={isModalVisible}
                onOk={handleSubmit}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setEditingDirector(null);
                }}
                width={600}
                destroyOnClose
                confirmLoading={isSubmitting} // Индикатор загрузки на кнопке

            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[
                            // { required: true, message: 'Please input first name!' },
                            { max: 20, message: 'Max length is 20 characters' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="secondName"
                        label="Second Name"
                        rules={[{ max: 20, message: 'Max length is 20 characters' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[
                            // { required: true, message: 'Please input last name!' },
                            { max: 20, message: 'Max length is 20 characters' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DirectorsPage;