import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  getDisplayDate(date: Date): string {
    const year: number = date.getFullYear();
    const month: string = ("0" + (date.getMonth() + 1)).slice(-2);
    const day: string = ("0" + date.getDate()).slice(-2);
 
    return `${day}/${month}/${year}`;
  }

  getDisplayDateTime(datetime: Date): string {
    const year: number = datetime.getFullYear();
    const month: string = ("0" + (datetime.getMonth() + 1)).slice(-2);
    const day: string = ("0" + datetime.getDate()).slice(-2);
    const hour: string = ("0" + datetime.getHours()).slice(-2);
    const minute: string = ("0" + datetime.getMinutes()).slice(-2);
    const second: string = ("0" + datetime.getSeconds()).slice(-2);
 
    return `${day}/${month}/${year} à ${hour}:${minute}:${second}`;
  }
  getDate(d): string {
    let date = new Date(d.slice(0,10));
    const year: number = date.getFullYear();
    const month: string = ("0" + (date.getMonth() + 1)).slice(-2);
    const day: string = ("0" + date.getDate()).slice(-2);
    return `${day}/${month}/${year}`;
  }

}
