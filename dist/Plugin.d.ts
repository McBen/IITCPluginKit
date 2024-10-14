/// <reference path="../types/index.d.ts" />
import "../types";
export interface Class {
    init(): void;
}
export declare function Register(plugin: Class, name: string): void;
