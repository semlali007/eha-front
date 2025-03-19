export class Document {
    name: string;
    url: string;
    id: string;
    type: number;

    constructor(options: {
        name?: string,
        url?: string
        id?: string;
        type?: number;
    } = {}) {
        this.name = options.name || '';
        this.url = options.url || '';
        this.id = options.id || '';
        this.type = options.type || 0;
    }
}