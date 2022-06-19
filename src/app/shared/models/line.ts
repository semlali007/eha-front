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
                code: 'PGI-1',
                label: 'PGI-1',
                tooltip: 'Énergies',
            },
            {
                code: 'PGI-2',
                label: 'PGI-2',
                tooltip: 'Fonctions communes et SEI',
            },
            {
                code: 'PGI-4',
                label: 'PGI-4',
                tooltip: 'Commerce',
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