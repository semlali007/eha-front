export class Filiale {
    id: string;
    name: string;
    constructor(options: {
        id?: string,
        name?: string,
    } = {}) {
        this.id = options.id || null;
        this.name = options.name || '';
    }
}