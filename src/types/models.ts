export interface Person {
    id: number;
    firstName?: string;
    secondName?: string;
    lastName?: string;
}

export const getFullName = (person?: Person): string => {
    if (!person) return ''; // Handle undefined person
    return `${person.firstName || ''} ${person.secondName || ''} ${person.lastName || ''}`.replace(/\s+/g, ' ').trim();
};


export interface ActorDto extends Person {
    films?: FilmDto[];
}

export interface DirectorDto extends Person {
    films?: FilmDto[];
}

export interface FilmDto {
    id?: number;
    title: string;
    year: number;
    director: DirectorDto;
    actors: ActorDto[];
    link?: string;
}