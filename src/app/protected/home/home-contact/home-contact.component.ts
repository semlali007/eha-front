import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-contact',
  templateUrl: './home-contact.component.html',
  styleUrls: ['./home-contact.component.css']
})
export class HomeContactComponent implements OnInit {
  agentPath = "https://collab.intranet.edf.com/espaces/dadagrc/Lists/Liste%20des%20CAN%20et%20CAU/Par%20direction.aspx" ;
  agencyPath = "https://collab.intranet.edf.com/espaces/dadagrc/Lists/Annuaire%20des%20approvisionneurs" ;
  communityPath = "https://www.myelectricnetwork.fr/group/achat" ;
  directionPath = "https://collab.intranet.edf.com/espaces/dadagrc/trombidag/Forms/par%20Direction.aspx" ;
  accountingAgencyPath = "https://collab.intranet.edf.com/espaces/dadagrc/Lists/Liste%20des%20agences%20comptables";

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigate(url, target?:string){
    this.router.navigate(
      [url]
    );
  }

  externalNavigate(url, target?:string){
    window.open(url, target || '_self');
  }
}
