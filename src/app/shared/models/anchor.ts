import { Provider } from './provider';

export class Anchor {
    status: boolean;
    message: string;
    maxRadius: number;
    maxProviders: number;
    activeProviders: Provider[];
    notActiveProviders: Provider[];

    constructor(options: {
        status?: boolean,
        message?: string,
        maxRadius?: number,
        maxProviders?: number,
        activeProviders?: Provider[],
        notActiveProviders?: Provider[],

    } = {}) {
        this.status = options.status || false;
        this.message = options.message || '';
        this.maxRadius = options.maxRadius || null;
        this.maxProviders = options.maxProviders || null;
        this.activeProviders = options.activeProviders || [new Provider()];
        this.notActiveProviders = options.notActiveProviders || [new Provider()];

    }

}