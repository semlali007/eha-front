import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-contact',
  templateUrl: './home-contact.component.html',
  styleUrls: ['./home-contact.component.css']
})
export class HomeContactComponent implements OnInit {
  agentPath = "https://edfonline.sharepoint.com/sites/DAG-RC-INFOS/Lists/Annuaire%20CAN%20CAU/Tous%20les%20lments%20%20tri.aspx" ;
  agencyPath = "https://edfonline.sharepoint.com/sites/DAG-RC-INFOS/Lists/Annuaire%20des%20approvisionneurs/AllItems.aspx?viewid=46a75d35%2De1c2%2D4e44%2Db9ef%2Dbebfb90568bf" ;
  communityPath = "https://www.myelectricnetwork.fr/group/achat" ;
  directionPath = "https://edfonline.sharepoint.com/sites/DAG-RC-INFOS/SitePages/Organisation---Informations-Pratiques.aspx" ;
  accountingAgencyPath = "https://edfonline.sharepoint.com/sites/DAG-RC-INFOS/Lists/Annuaire%20Comptable/AllItems.aspx";

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
