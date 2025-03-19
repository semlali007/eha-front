export class Lot {
    name: string;
    description: string;

    constructor(options: {
        name?: string,
        description?: string
    } = {}) {
        this.name = options.name || '';
        this.description = options.description || '';
    }
}