// components/DirectorList.tsx
import { useEffect, useState } from "react";
import { DirectorDto } from "../types/models";
import { getDirectors, deleteDirector, putDirector } from "../api/api";

export const DirectorList = () => {
    const [directors, setDirectors] = useState<DirectorDto[]>([]);
    const [editingDirector, setEditingDirector] = useState<DirectorDto | null>(null);

    useEffect(() => {
        loadDirectors();
    }, []);

    const loadDirectors = async () => {
        const data = await getDirectors();
        setDirectors(data);
    };

    const handleDelete = async (id: number) => {
        await deleteDirector(id);
        loadDirectors();
    };

    const handleEdit = (director: DirectorDto) => {
        setEditingDirector(director);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingDirector && editingDirector.id) {
            await putDirector(editingDirector.id, editingDirector);
            setEditingDirector(null);
            loadDirectors();
        }
    };

    return (
        <div>
            <h2>Режиссёры</h2>
            {editingDirector ? (
                <form onSubmit={handleUpdate}>
                    <input
                        value={editingDirector.firstName}
                        onChange={(e) => setEditingDirector({ ...editingDirector, firstName: e.target.value })}
                    />
                    <input
                        value={editingDirector.lastName}
                        onChange={(e) => setEditingDirector({ ...editingDirector, lastName: e.target.value })}
                    />
                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={() => setEditingDirector(null)}>Отмена</button>
                </form>
            ) : (
                <ul>
                    {directors.map((director) => (
                        <li key={director.id}>
                            {director.firstName} {director.lastName}
                            <button onClick={() => handleEdit(director)}>Редактировать</button>
                            <button onClick={() => handleDelete(director.id)}>Удалить</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};