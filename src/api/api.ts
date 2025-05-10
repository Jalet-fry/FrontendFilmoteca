// api/api.ts
import { ActorDto, DirectorDto, FilmDto } from "../types/models";

const API_URL = "http://localhost:8080";

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
    }
    return response.json();
};
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
    return handleResponse(response);
};

export const putActor = async (actor: ActorDto): Promise<void> => {
    await fetch(`${API_URL}/actors`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actor),
    });
};

export const patchActor = async (actor: Partial<ActorDto>): Promise<void> => {
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

// Directors
export const getDirectors = async (): Promise<DirectorDto[]> => {
    const response = await fetch(`${API_URL}/directors/all`);
    return handleResponse(response);
};

export const getDirectorById = async (id: number): Promise<DirectorDto> => {
    const response = await fetch(`${API_URL}/directors/${id}`);
    return handleResponse(response);
};

export const createDirector = async (director: Omit<DirectorDto, "id">): Promise<DirectorDto> => {
    const response = await fetch(`${API_URL}/directors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(director),
    });
    return handleResponse(response);
};

export const putDirector = async (director: DirectorDto): Promise<void> => {
    await fetch(`${API_URL}/directors`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(director),
    });
};

export const patchDirector = async (director: Partial<DirectorDto>): Promise<void> => {
    await fetch(`${API_URL}/directors`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(director),
    });
};

export const deleteDirector = async (id: number): Promise<void> => {
    await fetch(`${API_URL}/directors/${id}`, {
        method: "DELETE",
    });
};

//Film
export const getFilms = async (): Promise<FilmDto[]> => {
    const response = await fetch(`${API_URL}/films/all`);
    return handleResponse(response);
};

export const getFilmById = async (id: number): Promise<FilmDto> => {
    const response = await fetch(`${API_URL}/films/${id}`);
    return handleResponse(response);
};

export const createFilm = async (film: Omit<FilmDto, "id">): Promise<FilmDto> => {
    const response = await fetch(`${API_URL}/films`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(film),
    });
    return handleResponse(response);
};

export const putFilm = async (film: FilmDto): Promise<void> => {
    await fetch(`${API_URL}/films`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(film),
    });
};

export const patchFilm = async (film: Partial<FilmDto>): Promise<void> => {
    await fetch(`${API_URL}/films`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(film),
    });
};

export const deleteFilm = async (id: number): Promise<void> => {
    await fetch(`${API_URL}/films/${id}`, {
        method: "DELETE",
    });
};