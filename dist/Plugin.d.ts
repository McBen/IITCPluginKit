/// <reference path="../types/index.d.ts" />
export interface Class {
    init(): void;
}
export declare function Register(plugin: Class, name: string): void;
