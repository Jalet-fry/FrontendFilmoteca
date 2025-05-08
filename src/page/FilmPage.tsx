import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Space, Tag, message, Popconfirm, Form } from 'antd';
import { getFilms, createFilm, putFilm, patchFilm, deleteFilm, getActors, getDirectors } from '../api/api';
import { FilmForm } from '../components/FilmForm';
import { FilmDto } from "../types/models";

const FilmsPage: React.FC = () => {
    const [films, setFilms] = useState<FilmDto[]>([]);
    const [actors, setActors] = useState<any[]>([]);
    const [directors, setDirectors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingFilm, setEditingFilm] = useState<FilmDto | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [filmsData, actorsData, directorsData] = await Promise.all([
                getFilms(),
                getActors(),
                getDirectors()
            ]);
            setFilms(filmsData);
            setActors(actorsData);
            setDirectors(directorsData);
        } catch (error) {
            message.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingFilm) {
                await putFilm(editingFilm.id, values);
                message.success('Film put successfully');
            } else {
                await createFilm(values);
                message.success('Film created successfully');
            }
            handleModalClose();
            fetchData();
        } catch (error) {
            message.error('Error saving film');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteFilm(id);
            message.success('Film deleted successfully');
            fetchData();
        } catch (error) {
            message.error('Error deleting film');
        }
    };

    const handleModalClose = () => {
        form.resetFields();
        setEditingFilm(null);
        setIsModalVisible(false);
    };

    const handleEditClick = (record: FilmDto) => {
        form.setFieldsValue({
            ...record,
            directorId: record.director?.id,
            actorIds: record.actors?.map(actor => actor.id)
        });
        setEditingFilm(record);
        setIsModalVisible(true);
    };

    const handleAddClick = () => {
        form.resetFields();
        setEditingFilm(null);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
        },
        {
            title: 'Director',
            dataIndex: 'director',
            key: 'director',
            render: (director: any) => director?.firstName + ' '
                + director?.secondName + ' ' + director?.lastName,
        },
        {
            title: 'Actors',
            dataIndex: 'actors',
            key: 'actors',
            render: (actors: any[]) => (
                <>
                    {actors?.map(actor => (
                        <Tag key={actor.id}>{actor.firstName} {actor.secondName} {actor.lastName}</Tag>
                    ))}
                </>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: FilmDto) => (
                <Space size="middle">
                    <Button onClick={() => handleEditClick(record)}>Edit</Button>
                    <Popconfirm
                        title="Are you sure to delete this film?"
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
                Add Film
            </Button>

            <Table
                columns={columns}
                dataSource={films}
                rowKey="id"
                loading={loading}
                bordered
            />

            <Modal
                title={editingFilm ? 'Edit Film' : 'Add Film'}
                visible={isModalVisible}
                onOk={handleSubmit}
                onCancel={handleModalClose}
                width={800}
                destroyOnClose
            >
                <FilmForm
                    form={form}
                    actors={actors}
                    directors={directors}
                />
            </Modal>
        </div>
    );
};

export default FilmsPage;