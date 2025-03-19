export class Beneficiary {
    code: string;
    label: string;

    constructor(options: {
        code?: string,
        label?: string
    } = {}) {
        this.code = options.code || '';
        this.label = options.label || '';
    }
}