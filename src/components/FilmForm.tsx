import React from 'react';
import { Form, Input, Select, InputNumber } from 'antd';
import { FilmDto } from "../types/models";

const { Option } = Select;

interface Person {
    id: number;
    firstName: string;
    secondName?: string;
    lastName: string;
}

interface FilmFormProps {
    form: any;
    directors: Person[];
    actors: Person[];
}

export const FilmForm: React.FC<FilmFormProps> = ({ form, directors, actors }) => {
    return (
        <Form form={form} layout="vertical">
            <Form.Item
                name="title"
                label="Title"
                rules={[
                    { required: true, message: 'Please input film title!' },
                    { max: 20, message: 'Title must be at most 20 characters' }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="year"
                label="Year"
                rules={[
                    { required: true, message: 'Please input release year!' },
                    { type: 'number', min: 1896, max: 2077 }
                ]}
            >
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="directorId"
                label="Director"
                rules={[{ required: true, message: 'Please select director!' }]}
            >
                <Select placeholder="Select director">
                    {directors.map(director => (
                        <Option key={director.id} value={director.id}>
                            {`${director.firstName} ${director.secondName || ''} ${director.lastName}`}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="actorIds"
                label="Actors"
            >
                <Select mode="multiple" placeholder="Select actors">
                    {actors.map(actor => (
                        <Option key={actor.id} value={actor.id}>
                            {`${actor.firstName} ${actor.secondName || ''} ${actor.lastName}`}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        </Form>
    );
};