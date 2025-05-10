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

            handleModalClose();
            fetchActors();
        } catch (error) {
            message.error(error instanceof Error ? error.message : 'Error saving actor');
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
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
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
                            {film.title} ({film.year}) - {getFullName(film.director)}
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
                columns={columns}
                dataSource={actors}
                rowKey="id"
                loading={loading}
                bordered
            />

            <Modal
                title={editingActor ? 'Edit Actor' : 'Add Actor'}
                visible={isModalVisible}
                onOk={handleSubmit}
                onCancel={handleModalClose}
                width={600}
                destroyOnClose
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