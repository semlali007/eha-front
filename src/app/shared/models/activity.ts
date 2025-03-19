export class Activity {
    code: string;
    count: number;

    constructor(options: {
        code?: string,
        count?: number
    } = {}) {
        this.code = options.code || '';
        this.count = options.count || 0;
    }
}