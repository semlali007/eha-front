export class PurchaseStatus {
    code: number;
    label: string;
    constructor(options: {
        code?: number,
        label?: string
    } = {}) {
        this.code = options.code || null;
        this.label = options.label || '';
    }

    getStatusList() {
        return [
            {
                code: 1,
                label: 'Initialisée',
            },
            {
                code: 2,
                label: 'Transmise PHA',
            },
            {
                code: 3,
                label: 'Soumise au manager',
            },
            {
                code: 4,
                label: 'Affectée à l\'acheteur',
            },
            {
                code: 5,
                label: 'Intégrée en affaire',
            },
            {
                code: 6,
                label: 'Refusée',
            }
        ];
    }
 
    getLabel() {
        let label = '';
        this.getStatusList().forEach(s => {
            if (s.code == this.code) {
                label = s.label;
            }
        })

        return label;
    }
}