import { Component, OnInit, Input } from '@angular/core';
import { Anchor } from 'src/app/shared/models/anchor';
import { DownloadFileService } from 'src/app/core/services/download-file.service';


@Component({
  selector: 'app-anchor-result-search-params',
  templateUrl: './anchor-result-search-params.component.html',
  styles: [
  ]
})
export class AnchorResultSearchParamsComponent implements OnInit {
  @Input() anchor: Anchor = new Anchor();
  @Input() filter: any;
  providers:any = null;
  constructor(
    private downloadService :DownloadFileService
  ) { }

  ngOnInit(): void {
  }

  export(){
    //To do
    let data = "contrats\tfournisseur\tcode postal\tville\tcode\tNACE";
    this.anchor.activeProviders.forEach(
      /* Active provider data */
      p => {
        data += "\n" + 'oui' + "\t" + p.label + "\t" + p.zipcode + "\t" + p.town + "\t" + p.code + "\t" + p.nace;
      }
    )
    this.anchor.notActiveProviders.forEach(
      /* Not active provider data */
      p => {
        data += "\n" + 'non' + "\t" + p.label + "\t" + p.zipcode + "\t" + p.town + "\t" + p.code + "\t" + p.nace;      }
    )
    this.downloadService.downloadCSV(data);
  }
}
