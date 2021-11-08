import { DatePipe } from '@angular/common';


export interface News_ {
    id: number;
    title: string;
    description: string;
    date: Date | undefined;
  }

//   const pipe = new DatePipe('fr-FR');
//   const now = Date.now();
//   const myDate = pipe.transform(now, 'short');
   
   export const newz = [
        {
          id: 1,
          title: 'News 1',
          description: 'Le produit 1 est disponible!',
          date: undefined ,
        },
    
        {
            id: 2,
            title: 'News 2',
            description: 'Le produit 2 est disponible!',
            date: undefined ,
          },
      ];



  
