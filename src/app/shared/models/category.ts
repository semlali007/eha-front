export class Category {
    code: number;
    label: string;

    constructor(options: {
        code?: number,
        label?: string
    } = {}) {
        this.code = options.code || 0;
        this.label = options.label || '';
    }
}