// components/DirectorForm.tsx
import { useState } from "react";
import { DirectorDto } from "../types/models";
import { createDirector } from "../api/api";

export const DirectorForm = () => {
    const [director, setDirector] = useState<Omit<DirectorDto, "id">>({
        firstName: "",
        secondName: "",
        lastName: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createDirector(director);
        setDirector({ firstName: "", secondName: "", lastName: "" });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={director.firstName}
                onChange={(e) => setDirector({...director, firstName: e.target.value})}
                placeholder="firstName"
            />
            <input
                value={director.secondName}
                onChange={(e) => setDirector({...director, secondName: e.target.value})}
                placeholder="secondName"
            />
            <input
                value={director.lastName}
                onChange={(e) => setDirector({...director, lastName: e.target.value})}
                placeholder="lastName"
            />
            <button type="submit">Add</button>
        </form>
    );
};