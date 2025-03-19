import { Role } from "./role";

export class User {
    readonly id: string; // id de l’utilisateur
    email: string; // email de l’utilisateur
    name: string; // nom de l’utilisateur
    nni: string; // nni de l’utilisateur
    direction: string;
    roles: Role[] = [];
    status: [string];

    constructor(options: {
        id?: string,
        email?: string,
        nni?: string,
        name?: string,
        direction?: string,
        roles?: Role[],
        status?:[string],
    } = {}) {
        this.id = options.id || null;
        this.email = options.email || '';
        this.name = options.name || '';
        this.nni = options.nni || '';
        this.direction = options.direction || '';
        this.roles = options.roles;
        this.status = options.status
    }

    hasRole(role: string): boolean {
        return this.roles.some(function(el) {
            return el.name === role;
          });
    }
}
