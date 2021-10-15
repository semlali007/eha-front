export class UserNews {
    id:number;
    nni:string;
    date:Date;
    isSelected:boolean;
    constructor(id:number,nni:string, date?:Date, isSelected?:boolean) {
        this.id = id;
        this.nni = nni;
        this.date = date || new Date;
        this.isSelected = isSelected || false;
    }
}