// api/api.ts
import { ActorDto, DirectorDto, FilmDto } from "../types/models";

const API_URL = "http://localhost:8080";

// Actors
export const getActors = async (): Promise<ActorDto[]> => {
    const response = await fetch(`${API_URL}/actors/all`);
    return response.json();
};

export const getActorById = async (id: number): Promise<ActorDto> => {
    const response = await fetch(`${API_URL}/actors/${id}`);
    return response.json();
};

export const createActor = async (actor: Omit<ActorDto, "id">): Promise<ActorDto> => {
    const response = await fetch(`${API_URL}/actors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actor),
    });
    return response.json();
};

export const updateActor = async (id: number, actor: ActorDto): Promise<void> => {
    await fetch(`${API_URL}/actors`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actor),
    });
};

export const patchActor = async (id: number, actor: Partial<ActorDto>): Promise<void> => {
    await fetch(`${API_URL}/actors`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actor),
    });
};

export const deleteActor = async (id: number): Promise<void> => {
    await fetch(`${API_URL}/actors/${id}`, {
        method: "DELETE",
    });
};

// Добавляем в api.ts
// Directors
export const getDirectors = async (): Promise<DirectorDto[]> => {
    const response = await fetch(`${API_URL}/directors/all`);
    return response.json();
};

export const getDirectorById = async (id: number): Promise<DirectorDto> => {
    const response = await fetch(`${API_URL}/directors/${id}`);
    return response.json();
};

export const createDirector = async (director: Omit<DirectorDto, "id">): Promise<DirectorDto> => {
    const response = await fetch(`${API_URL}/directors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(director),
    });
    return response.json();
};

export const updateDirector = async (id: number, director: DirectorDto): Promise<void> => {
    await fetch(`${API_URL}/directors`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(director),
    });
};

export const deleteDirector = async (id: number): Promise<void> => {
    await fetch(`${API_URL}/directors/${id}`, {
        method: "DELETE",
    });
};