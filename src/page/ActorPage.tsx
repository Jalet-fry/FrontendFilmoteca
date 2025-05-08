import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Space, Tag, message, Popconfirm, Form } from 'antd';
import { getActors, createActor, putActor, deleteActor, patchActor} from '../api/api';
import {ActorDto, DirectorDto, FilmDto} from "../types/models";
import { ActorForm } from '../components/ActorForm';
import { FormInstance } from 'antd/es/form';
import any = jasmine.any;

const ActorsPage: React.FC = () => {
    const [actors, setActors] = useState<ActorDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingActor, setEditingActor] = useState<ActorDto | null>(null);
    const [form] = Form.useForm<ActorDto>();

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
            if (editingActor) {
                await putActor(editingActor.id, values);
                message.success('Actor updated successfully');
            } else {
                await createActor(values);
                message.success('Actor created successfully');
            }
            handleModalClose();
            fetchActors();
        } catch (error) {
            message.error('Error saving actor');
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
                        <Tag key={film.id}>{film.title} {film.year}</Tag>
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
                        onConfirm={() => handleDelete(record.id)}
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
                width={800}
                destroyOnClose
            >
                <ActorForm form={form} />
            </Modal>
        </div>
    );
};

export default ActorsPage;