import { HotlineCategory } from "./hotlineCategory";

export class HotlineFamily {
    code: string;
    label: string;
    categories: HotlineCategory[];

    constructor(options: {
        code?: string,
        label?: string,
        categories?: HotlineCategory[]
    } = {}) {
        this.code = options.code || '';
        this.label = options.label || '';
        this.categories = options.categories || [new HotlineCategory()];
    }
}