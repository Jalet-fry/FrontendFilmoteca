// components/ActorForm.tsx
import { useState } from "react";
import { ActorDto } from "../types/models";
import { createActor } from "../api/api";

export const ActorForm = () => {
    const [actor, setActor] = useState<Omit<ActorDto, "id">>({
        firstName: "",
        secondName: "",
        lastName: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createActor(actor);
        setActor({ firstName: "", secondName: "", lastName: "" });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={actor.firstName}
                onChange={(e) => setActor({...actor, firstName: e.target.value})}
                placeholder="firstName"
            />
            <input
                value={actor.secondName}
                onChange={(e) => setActor({...actor, secondName: e.target.value})}
                placeholder="secondName"
            />
            <input
                value={actor.lastName}
                onChange={(e) => setActor({...actor, lastName: e.target.value})}
                placeholder="lastName"
            />
            <button type="submit">Добавить</button>
        </form>
    );
};