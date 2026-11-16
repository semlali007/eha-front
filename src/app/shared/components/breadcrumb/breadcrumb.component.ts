import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BreadcrumbComponent implements OnInit {
  /**
   * Liste des items du fil d'Ariane. Si fournie en input par le parent,
   * elle prime sur le breadcrumb statique défini dans route.data.
   * Format : [{ label: string, route: string | null }, ...]
   */
  @Input() breadcrumbs: any[];

  /** Labels qui affichent une icône maison sur le 1er item du fil. */
  private static readonly HOME_LABELS = ['accueil', 'tableau de bord', 'administration'];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Mode "input" : le parent gère lui-même la liste — pas de subscription.
    if (this.breadcrumbs != null) return;

    // Mode "route" : breadcrumb statique lu depuis route.data
    this.activatedRoute.data.subscribe(response => {
      this.breadcrumbs = response.breadcrumb;
    });
  }

  /** Détecte si un libellé correspond à une page "racine" (icône maison). */
  isHomeLabel(label: string): boolean {
    if (!label) return false;
    return BreadcrumbComponent.HOME_LABELS.includes(label.trim().toLowerCase());
  }

  navigate(link: string) {
    this.router.navigate([link]);
  }
}
