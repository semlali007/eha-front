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
    // Identifiants entreprise (INSEE) — nullable : null tant que le fournisseur n'a pas été matché.
    siren: string | null;
    numeroTva: string | null;
    codeNaf: string | null;
    constructor(options: {
        code?: string,
        label?: string,
        siret?: string,
        town?: string,
        zipcode?: string,
        nace?: string,
        distance?: number,
        activities?: Activity[],
        siren?: string | null,
        numeroTva?: string | null,
        codeNaf?: string | null,
    } = {}) {
        this.code = options.code || '';
        this.label = options.label || '';
        this.siret = options.siret || '';
        this.town = options.town || '';
        this.zipcode = options.zipcode || '';
        this.nace = options.nace || '';
        this.distance = options.distance || 0;
        this.activities = options.activities || [];
        this.siren = options.siren ?? null;
        this.numeroTva = options.numeroTva ?? null;
        this.codeNaf = options.codeNaf ?? null;
    }
}