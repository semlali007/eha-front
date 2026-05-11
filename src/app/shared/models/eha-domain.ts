export class EhaDomain {
    code: number;
    label: string;
    type: string

    constructor(options: {
        code?: number,
        label?: string,
        type?: string
    } = {}) {
        this.code = options.code || 0;
        this.label = options.label || '';
        this.type = options.type || '';
    }
}
