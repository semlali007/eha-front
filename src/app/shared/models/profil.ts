import { Filiale } from "./filiale";
import { Role } from "./role";

export class Profil {
    gardianGroupID: string; // id de l’utilisateur
    auditTrackingId: string; // email de l’utilisateur
    cn: string; // nom de l’utilisateur
    departmentNumber: string; // nni de l’utilisateur
    employeeType: string;
    gardianHierarchie: string;
    filiales: Filiale[];
    filiales0: Filiale[];
    givenName: string;
    roles: Role[];

    constructor(options: {
        gardianGroupID?: string,
        auditTrackingId?: string,
        cn?: string,
        departmentNumber?: string,
        employeeType?: string,
        gardianHierarchie?: string,
        filiales?: Filiale[],
        filiales0?: Filiale[],
        givenName?: string,
        roles?: Role[]
    } = {}) {
        this.gardianGroupID = options.gardianGroupID || '';
        this.auditTrackingId = options.auditTrackingId || '';
        this.cn = options.cn || '';
        this.departmentNumber = options.departmentNumber || '';
        this.employeeType = options.employeeType || '';
        this.gardianHierarchie = options.gardianHierarchie || '';
        this.filiales = options.filiales || [];
        this.filiales0 = options.filiales0 || [];
        this.givenName = options.givenName || '';
        this.roles = options.roles || [];
    }

}