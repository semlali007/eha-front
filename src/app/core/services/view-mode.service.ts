import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ViewMode = 'normal' | 'contrat-groupe';

@Injectable({
    providedIn: 'root'
})
export class ViewModeService {
    private readonly STORAGE_KEY = 'eha-view-mode';

    private modeSubject = new BehaviorSubject<ViewMode>('normal');
    public mode$: Observable<ViewMode> = this.modeSubject.asObservable();

    constructor() {
        this.restoreMode();
    }

    /**
     * Active le mode contrat groupe
     */
    setContratGroupeMode(): void {
        this.setMode('contrat-groupe');
    }

    /**
     * Active le mode normal (vitrine de l'offre)
     */
    setNormalMode(): void {
        this.setMode('normal');
    }

    /**
     * Retourne le mode actuel
     */
    getCurrentMode(): ViewMode {
        return this.modeSubject.value;
    }

    /**
     * Vérifie si on est en mode contrat groupe
     */
    isContratGroupeMode(): boolean {
        return this.modeSubject.value === 'contrat-groupe';
    }

    /**
     * Vérifie si on est en mode normal
     */
    isNormalMode(): boolean {
        return this.modeSubject.value === 'normal';
    }
    private setMode(mode: ViewMode): void {
        this.modeSubject.next(mode);
        sessionStorage.setItem(this.STORAGE_KEY, mode);
    }

    private restoreMode(): void {
        const savedMode = sessionStorage.getItem(this.STORAGE_KEY) as ViewMode;
        if (savedMode && (savedMode === 'normal' || savedMode === 'contrat-groupe')) {
            this.modeSubject.next(savedMode);
        }
    }

    /**
     * Réinitialise le mode à normal (utile pour les déconnexions)
     */
    reset(): void {
        this.setMode('normal');
    }
}
