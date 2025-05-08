// types/models.ts
export interface ActorDto {
    id?: number;
    firstName: string;
    secondName: string;
    lastName: string;
    films?: FilmDto[];
}

export interface DirectorDto {
    id: number;
    firstName: string;
    secondName: string;
    lastName: string;
    films?: FilmDto[];
}

export interface FilmDto {
    id: number;
    title: string;
    year?: number;
    link?: string;
    director?: DirectorDto;
    actors?: ActorDto[];
}