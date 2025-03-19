import { Activity } from "./activity";

export class Provider {
    code: string;
    label: string;
    siret: string;
    town: string;
    zipcode: string;
    nace: string;
    distance: number;
    activities: Activity[];
    constructor(options: {
        code?: string,
        label?: string,
        siret?: string,
        town?: string,
        zipcode?: string,
        nace?: string,
        distance?: number,
        activities?: Activity[],
    } = {}) {
        this.code = options.code || '';
        this.label = options.label || '';
        this.siret = options.siret || '';
        this.town = options.town || '';
        this.zipcode = options.zipcode || '';
        this.nace = options.nace || '';
        this.distance = options.distance || 0;
        this.activities = options.activities || [];
    }
}