import { Profil } from "./profil";

export class User {
    readonly id: string; // id de l’utilisateur
    email: string; // email de l’utilisateur
    name: string; // nom de l’utilisateur
    nni: string; // nni de l’utilisateur
    direction: string;
    roles: string[] = []
    profil: Profil ;

    constructor(options: {
        id?: string,
        email?: string,
        nni?: string,
        name?: string,
        direction?: string,
        roles?: string[],
        profil?: Profil
    } = {}) {
        this.id = options.id || null;
        this.email = options.email || '';
        this.name = options.name || '';
        this.nni = options.nni || '';
        this.direction = options.direction || '';
        this.roles = options.roles || [];
        this.profil = options.profil || null;
    }

    hasRole(role: string): boolean {
        //console.log('role', role);
        //console.log('this.profil', this.profil);
        return this.profil.roles.some(function(el) {
            return el.name === role;
          }); 
    }
}