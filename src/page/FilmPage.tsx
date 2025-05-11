import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Space, Tag, message, Popconfirm, Form } from 'antd';
import { getFilms, createFilm, putFilm, deleteFilm, getActors, getDirectors } from '../api/api';
import { FilmForm } from '../components/FilmForm';
import { FilmDto, DirectorDto, ActorDto, getFullName } from "../types/models";

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
            console.log("Form values:", values); // 1. Что введено в форме


            // Находим полные объекты директора и актеров
            const director = directors.find(d => d.id === values.directorId);
            const selectedActors = actors.filter(a => values.actorIds?.includes(a.id));
            console.log("Selected director:", director); // 2. Найденный режиссёр
            console.log("Selected actors:", selectedActors); // 3. Выбранные актёры
            // Очищаем вложенные films у director и actors
            const cleanedDirector = director ? { ...director, id : null, films: null } : null;
            const cleanedActors = selectedActors.map(actor => ({ ...actor, id : null, films: null }));


            if (!director) {
                throw new Error('Director not found');
            }

            const filmDto: FilmDto = {
                ...(editingFilm || {}),
                title: values.title,
                year: values.year,
                director: cleanedDirector,
                actors: cleanedActors,
            };

            console.log("Data being sent to server:", filmDto); // 4. Итоговый объект
            if (editingFilm?.id) {
                await putFilm(filmDto);
                message.success('Film updated successfully');
            } else {
                await createFilm(filmDto);
                message.success('Film created successfully');
            }

            handleModalClose();
            fetchData();
        } catch (error) {
            console.error("Error in handleSubmit:", error); // 5. Ошибки
            message.error(error instanceof Error ? error.message : 'Error saving film');
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
            title: '№',
            key: 'index',
            render: (_: any, __: any, index: number) => index + 1,
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
            dataIndex: ['director'],
            key: 'director',
            render: (director: DirectorDto) => getFullName(director),
        },
        {
            title: 'Actors',
            dataIndex: ['actors'],
            key: 'actors',
            render: (actors: any[]) => (
                <>
                    {actors?.map(actor => (
                        <Tag key={actor.id}>{getFullName(actor)}
                        </Tag>
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