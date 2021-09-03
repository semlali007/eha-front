export class Line {
    code: string;
    label: string;

    constructor(options: {
        code?: string,
        label?: string
    } = {}) {
        this.code = options.code || '';
        this.label = options.label || this.getCode();
    }

    getLineList() {
        return [
            {
                code: 'F1',
                label: 'Ligne 1',
            },
            {
                code: 'F2',
                label: 'Ligne 2',
            },
            {
                code: 'F4',
                label: 'Ligne 4',
            }
        ];
    }

    getCode() {
        let label = '';
        this.getLineList().forEach(s => {
            if (s.code == this.code) {
                label = s.label;
            }
        })
        return label;
    }
}