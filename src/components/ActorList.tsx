// components/ActorList.tsx
import { useEffect, useState } from "react";
import { ActorDto } from "../types/models";
import { getActors, deleteActor, getActorById, putActor } from "../api/api";

export const ActorList = () => {
    const [actors, setActors] = useState<ActorDto[]>([]);
    const [editingActor, setEditingActor] = useState<ActorDto | null>(null);

    useEffect(() => {
        loadActors();
    }, []);

    const loadActors = async () => {
        const data = await getActors();
        setActors(data);
    };

    const handleDelete = async (id: number) => {
        await deleteActor(id);
        loadActors();
    };

    const handleEdit = (actor: ActorDto) => {
        setEditingActor(actor);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingActor && editingActor.id) {
            await putActor(editingActor.id, editingActor);
            setEditingActor(null);
            loadActors();
        }
    };

    return (
        <div>
            <h2>Актёры</h2>
            {editingActor ? (
                <form onSubmit={handleUpdate}>
                    <input
                        value={editingActor.firstName}
                        onChange={(e) => setEditingActor({ ...editingActor, firstName: e.target.value })}
                    />
                    <input
                        value={editingActor.lastName}
                        onChange={(e) => setEditingActor({ ...editingActor, lastName: e.target.value })}
                    />
                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={() => setEditingActor(null)}>Отмена</button>
                </form>
            ) : (
                <ul>
                    {actors.map((actor) => (
                        <li key={actor.id}>
                            {actor.firstName} {actor.lastName}
                            <button onClick={() => handleEdit(actor)}>Редактировать</button>
                            <button onClick={() => handleDelete(actor.id!)}>Удалить</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};