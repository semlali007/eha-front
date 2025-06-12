import { Contract } from './contract';
import { Lot } from './lot';
import { Provider } from './provider';
import { Document } from './document';
import { Beneficiary } from './beneficiary';
import { Stipulation } from './stipulation';//*** */
import { Area } from './area';
import { Direction } from './direction';
import { Committee } from './committee';
import { Option } from './option';
import { Domain } from './domain';
import { Category } from './category';
export class Sheet {
    readonly id: string;
    title: string;
    comments: string;
    words: string;
    startDate: string;
    endDate: string;
    contracts: Contract[];
    lots: Lot[];
    status: number;
    dauphin: boolean;
    edfOpen: boolean;
    stipulationForOthers: boolean;
    partnership: boolean;
    protectedSector: boolean;
    providers: Provider[];
    beneficiaries: Beneficiary[];
    stipulationAutrui: Stipulation[];//*************************************** */
    areas: Area[];
    directions: Direction[];
    documents: Document[];
    updatedAt: string;
    committee: Committee;
    showcase: boolean;
    options: Option[];
    createdAt: string;
    subscribed: boolean;
    netachatId: number;
    content: string;
    netachatType: string;
    domains: Domain[];
    subDomains: Domain[];
    history: any[];
    category: Category;
    contratGroupe: string;
    miseAJourDonnee: string;
    supplierSize: {id: number, name: string};

    constructor(options: {
        id?: string,
        title?: string,
        comments?: string,
        words?: string,
        startDate?: string,
        endDate?: string,
        contracts?: Contract[],
        lots?: Lot[],
        status?: number,
        dauphin?: boolean,
        edf_open?: boolean,
        stipulation_for_others?: boolean,
        partnership?: boolean,
        protected_sector?: boolean,
        providers?: Provider[],
        beneficiaries?: Beneficiary[],
        stipulationAutrui?: Stipulation[],//************** */
        areas?: Area[],
        directions?: Direction[],
        documents?: Document[],
        updated_at?: string,
        committee?: Committee,
        category?: Category,
        showcase?: boolean,
        options?: Option[],
        created_at?: string,
        subscribed?:boolean,
        netachatId?: number,
        content?: string,
        netachatType?: string;
        domains?: Domain[];
        subDomains?: Domain[];
        history?: any[];
        contratGroupe?: string;
        miseAJourDonnee?: string;
        supplierSize?: {id: number, name: string};

    } = {}) {
        this.id = options.id || null;
        this.title = options.title || '';
        this.comments = options.comments || '';
        this.words = options.words || '';
        this.startDate = options.startDate || '';
        this.endDate = options.endDate || '';
        this.contracts = options.contracts || [new Contract()];
        this.lots = options.lots || [new Lot()];
        this.status = options.status || 0;
        this.dauphin = options.dauphin || false;
        this.edfOpen = options.edf_open || false;
        this.stipulationForOthers = options.stipulation_for_others || false;
        this.partnership = options.partnership || false;
        this.protectedSector = options.protected_sector || false;
        this.providers = options.providers || [];
        this.beneficiaries = options.beneficiaries || [];
        this.stipulationAutrui = options.stipulationAutrui || [];//*************************** */
        this.areas = options.areas || [];
        this.directions = options.directions || [];
        this.documents = options.documents || [];
        this.updatedAt = options.updated_at || '';
        this.committee = options.committee || new Committee();
        this.category =  options.category || new Category();
        this.showcase = options.showcase || false;
        this.options = options.options || [new Option()];
        this.createdAt = options.created_at || '';
        this.subscribed = options.subscribed || false;
        this.netachatId = options.netachatId || 0;
        this.netachatType = options.netachatType || '';
        this.content = options.content || '';
        this.domains = options.domains || [new Domain()];
        this.subDomains = options.subDomains || [new Domain()];
        this.history = options.history || [];
        this.contratGroupe = options.contratGroupe || '';
        this.miseAJourDonnee = options.miseAJourDonnee || '';
        this.supplierSize = options.supplierSize || null;
    }

}
