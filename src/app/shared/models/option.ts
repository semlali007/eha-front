export class Option {
    readonly id: string;
    startdate: string;
    enddate: string;
    constructor(options: {
        id?: string,
        startdate?: string,
        enddate?: string,
    } = {}) {
        this.id = options.id || null;
        this.startdate = options.startdate || '';
        this.enddate = options.enddate || '';
    }
}