export class Status {
    code: number;
    label: string;

    constructor(options: {
        code?: number,
        label?: string
    } = {}) {
        this.code = options.code || 0;
        this.label = options.label || this.getCode();
    }

    getStatusList() {
        return [
            {
                code: 0,
                label: 'Brouillon',
            },
            {
                code: 1,
                label: 'Publiée',
            },
            {
                code: -1,
                label: 'Archivée',
            }
        ];
    }

    getCode() {
        let label = '';
        this.getStatusList().forEach(s => {
            if (s.code == this.code) {
                label = s.label;
            }
        })
        return label;
    }
}