export class PurchaseSituationStatus {
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
                label: '00-EB En attente',
                class: 'class1',
                selected: false
            },
            {
                code: 2,
                label: '00-EB Renvoyé au client',
                class: 'class2',
                selected: false
            },
            {
                code: 3,
                label: '01-EB Initialisé',
                class: 'class3',
                selected: false
            },
            {
                code: 4,
                label: '02-EB Criblage',
                class: 'class4',
                selected: false
            },
            {
                code: 5,
                label: '03-EB Affecté',
                class: 'class4',
                selected: false
            },
            {
                code: 6,
                label: '04-EB En cours',
                class: 'class4',
                selected: false
            },
            {
                code: 7,
                label: '05-EB Terminé',
                class: 'class4',
                selected: false
            },
            {
                code: 8,
                label: '11-Achat Initialisé',
                class: 'class4',
                selected: false
            },
            {
                code: 9,
                label: '12-Achat En cours',
                class: 'class4',
                selected: false
            },
            {
                code: 10,
                label: '13-Achat Stratégie',
                class: 'class4',
                selected: false
            }
            ,
            {
                code: 11,
                label: '14-Achat Consultation',
                class: 'class4',
                selected: false
            }
            ,
            {
                code: 12,
                label: '15-Achat Négociation',
                class: 'class4',
                selected: false
            }
            ,
            {
                code: 13,
                label: '16-Achat Attribution',
                class: 'class4',
                selected: false
            }
            ,
            {
                code: 14,
                label: '17-Achat Terminé',
                class: 'class4',
                selected: false
            }
            ,
            {
                code: 15,
                label: '21-Contrat Initialisé',
                class: 'class4',
                selected: false
            },
            {
                code: 16,
                label: '22-Contrat En cours',
                class: 'class4',
                selected: false
            },
            {
                code: 17,
                label: '23-Contrat Terminé',
                class: 'class4',
                selected: false
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