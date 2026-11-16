import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { Area } from 'src/app/shared/models/area';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient, 
    private errorService: ErrorService,
    private loaderService: LoaderService,
  ) { }

  /**
   * Recherche d'autocomplétion des zones géographiques
   * @param text Texte à rechercher (minimum 3 caractères)
   * @returns Observable<Area[]> Liste des zones correspondantes filtrées
   */
  public requestAutocompleteItems(text: string): Observable<any> {
    const url = `${this.appConfigService.basePath}/areas`;
    return this.http
      .get<any>(url)
      .pipe(
        switchMap((response: any) => {
          const areas: Area[] = [];
          // Le backend retourne directement un array [{code, label}, ...]
          if (Array.isArray(response)) {
            response
              .filter(area => area.label.toLowerCase().includes(text.toLowerCase()))
              .forEach(area => {
                areas.push(new Area({
                  code: area.code.toString(),
                  label: area.label
                }));
              });
          }
          return of(areas);
        }),
        catchError(error => this.errorService.handleError(error))
      );
  }

  /**
   * Récupère la liste des zones géographiques
   * @returns Observable avec format {data: Area[], total: number}
   */
  public getList(params?: any): Observable<any> {
    const url = `${this.appConfigService.basePath}/areas`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      switchMap((response: any) => {
        const areas: Area[] = [];
        // Le backend retourne directement un array [{code, label}, ...]
        if (Array.isArray(response)) {
          response.forEach(area => {
            areas.push(new Area({
              code: area.code.toString(),
              label: area.label
            }));
          });
        }
        return of({
          data: areas,
          total: areas.length
        });
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  /**
   * Ajoute une nouvelle zone géographique
   * @param area Objet Area à ajouter
   * @returns Observable<any> Résultat de l'ajout
   */
  public add(area: Area): Observable<any> {
    const url = `${this.appConfigService.basePath}/areas`;
    const data = { "label": area.label };
    return this.http.post(url, data).pipe(
      tap(_ => console.log('Zone ajoutée avec succès')),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => console.log('Fin opération ajout zone'))
    );
  }

}
