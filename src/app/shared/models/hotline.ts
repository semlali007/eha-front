import { HotlineCategory } from "./hotlineCategory";
import { HotlineTheme } from "./hotlineTheme";

export class Hotline {
    theme: HotlineTheme;
    category: HotlineCategory;
    question: string;
    entity: string;

    constructor(options: {
        theme: HotlineTheme,
        category: HotlineCategory,
        question: string,
        entity: string
    }) {
        this.theme = options.theme;
        this.category = options.category;
        this.question = options.question;
        this.entity = options.entity;
    }
}