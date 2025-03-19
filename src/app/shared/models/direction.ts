export class Direction {
    code: string;
    label: string;
    tooltip: string;

    constructor(options: {
        code?: string,
        label?: string,
        tooltip?:string,
    } = {}) {
        this.code = options.code || '';
        this.label = options.label || '';
        this.tooltip = options.tooltip || '';
    }
}