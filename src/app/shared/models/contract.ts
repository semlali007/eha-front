import { Lot } from './lot';
export class Contract {
    code: string;
    provider: string;
    lots: Lot[];
    systems: string[];
    contacts: string;

    constructor(options: {
        code?: string,
        provider?: string,
        lots?: Lot[],
        systems?: string[],
        contacts?: string,
    } = {}) {
        this.code = options.code || '';
        this.provider = options.provider || '';
        this.lots = options.lots || [new Lot()];
        this.systems = options.systems || [];
        this.contacts = options.contacts || '';
    }
}