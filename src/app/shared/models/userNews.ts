export class UserNews {
    id:number;
    nni:string;
    date:Date;
    constructor(id:number,nni:string, date?:Date) {
        this.id = id;
        this.nni = nni;
        this.date = date || new Date;
    }
}