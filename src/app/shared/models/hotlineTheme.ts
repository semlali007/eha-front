export class HotlineTheme {
    code: number;
    label: string;

    constructor(options: {
        code?: number,
        label?: string
    } = {}) {
        this.code = options.code || null;
        this.label = options.label || '';
    }
}