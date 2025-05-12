import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Space, Tag, message, Popconfirm, Form, Input } from 'antd';
import { getActors, createActor, putActor, deleteActor } from '../api/api';
import {ActorDto, getFullName} from "../types/models";

const ActorsPage: React.FC = () => {
    const [actors, setActors] = useState<ActorDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingActor, setEditingActor] = useState<ActorDto | null>(null);
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false); // Новое состояние

    useEffect(() => {
        fetchActors();
    }, []);

    const fetchActors = async () => {
        setLoading(true);
        try {
            const data = await getActors();
            setActors(data);
        } catch (error) {
            message.error('Failed to fetch actors');
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async () => {
        setIsSubmitting(true); // Блокируем кнопку
        try {
            const values = await form.validateFields();
            const actorDto: ActorDto = {
                ...(editingActor || {}),
                ...values
            };

            if (editingActor) {
                await putActor(actorDto);
                message.success('Actor updated successfully');
            } else {
                await createActor(actorDto);
                message.success('Actor created successfully');
            }
            // 1. Сразу закрываем модальное окно
            setIsModalVisible(false);
            form.resetFields();
            setEditingActor(null);

            // 2. Показываем состояние загрузки
            // setLoading(true);

            // 3. Обновляем данные с небольшой задержкой
            await new Promise(resolve => setTimeout(resolve, 300));
            await fetchActors();

        } catch (error) {
            message.error(error instanceof Error ? error.message : 'Error saving actor');
        }
        finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteActor(id);
            message.success('Actor deleted successfully');
            fetchActors();
        } catch (error) {
            message.error('Error deleting actor');
        }
    };

    const handleModalClose = () => {
        form.resetFields();
        setEditingActor(null);
        setIsModalVisible(false);
    };

    const handleEditClick = (record: ActorDto) => {
        form.setFieldsValue(record);
        setEditingActor(record);
        setIsModalVisible(true);
    };

    const handleAddClick = () => {
        form.resetFields();
        setEditingActor(null);
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
            render: (_: any, record: ActorDto) => (
                <Space size="middle">
                    <Button onClick={() => handleEditClick(record)}>Edit</Button>
                    <Popconfirm
                        title="Are you sure to delete this actor?"
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
                Add Actor
            </Button>

            <Table
                className={loading ? 'table-loading' : 'table-update'}
                columns={columns}
                dataSource={actors}
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
                title={editingActor ? 'Edit Actor' : 'Add Actor'}
                className="modal-fade"
                visible={isModalVisible}
                onOk={handleSubmit}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setEditingActor(null);
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

export default ActorsPage;