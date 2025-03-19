export class Role {
    name: string;
    ou: string;
    dc: string
    constructor(options: {
        name?: string,
        ou?: string,
        dc?: string,
    } = {}) {
        this.name = options.name || '';
        this.ou = options.ou || '';
        this.dc = options.dc || '';
    }
}