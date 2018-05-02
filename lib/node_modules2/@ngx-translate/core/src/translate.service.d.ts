import { EventEmitter, InjectionToken } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { MissingTranslationHandler } from "./missing-translation-handler";
import { TranslateCompiler } from "./translate.compiler";
import { TranslateLoader } from "./translate.loader";
import { TranslateParser } from "./translate.parser";
import { TranslateStore } from "./translate.store";
export declare const USE_STORE: InjectionToken<string>;
export declare const USE_DEFAULT_LANG: InjectionToken<string>;
export interface TranslationChangeEvent {
    translations: any;
    lang: string;
}
export interface LangChangeEvent {
    lang: string;
    translations: any;
}
export interface DefaultLangChangeEvent {
    lang: string;
    translations: any;
}
export declare class TranslateService {
    store: TranslateStore;
    currentLoader: TranslateLoader;
    compiler: TranslateCompiler;
    parser: TranslateParser;
    missingTranslationHandler: MissingTranslationHandler;
    private useDefaultLang;
    private isolate;
    private loadingTranslations;
    private pending;
    private _onTranslationChange;
    private _onLangChange;
    private _onDefaultLangChange;
    private _defaultLang;
    private _currentLang;
    private _langs;
    private _translations;
    private _translationRequests;
    /**
     * An EventEmitter to listen to translation change events
     * onTranslationChange.subscribe((params: TranslationChangeEvent) => {
     *     // do something
     * });
     * @type {EventEmitter<TranslationChangeEvent>}
     */
    readonly onTranslationChange: EventEmitter<TranslationChangeEvent>;
    /**
     * An EventEmitter to listen to lang change events
     * onLangChange.subscribe((params: LangChangeEvent) => {
     *     // do something
     * });
     * @type {EventEmitter<LangChangeEvent>}
     */
    readonly onLangChange: EventEmitter<LangChangeEvent>;
    /**
     * An EventEmitter to listen to default lang change events
     * onDefaultLangChange.subscribe((params: DefaultLangChangeEvent) => {
     *     // do something
     * });
     * @type {EventEmitter<DefaultLangChangeEvent>}
     */
    readonly onDefaultLangChange: EventEmitter<DefaultLangChangeEvent>;
    /**
     * The default lang to fallback when translations are missing on the current lang
     */
    defaultLang: string;
    /**
     * The lang currently used
     * @type {string}
     */
    currentLang: string;
    /**
     * an array of langs
     * @type {Array}
     */
    langs: string[];
    /**
     * a list of translations per lang
     * @type {{}}
     */
    translations: any;
    /**
     *
     * @param store an instance of the store (that is supposed to be unique)
     * @param currentLoader An instance of the loader currently used
     * @param compiler An instance of the compiler currently used
     * @param parser An instance of the parser currently used
     * @param missingTranslationHandler A handler for missing translations.
     * @param isolate whether this service should use the store or not
     * @param useDefaultLang whether we should use default language translation when current language translation is missing.
     */
    constructor(store: TranslateStore, currentLoader: TranslateLoader, compiler: TranslateCompiler, parser: TranslateParser, missingTranslationHandler: MissingTranslationHandler, useDefaultLang?: boolean, isolate?: boolean);
    /**
     * Sets the default language to use as a fallback
     * @param lang
     */
    setDefaultLang(lang: string): void;
    /**
     * Gets the default language used
     * @returns string
     */
    getDefaultLang(): string;
    /**
     * Changes the lang currently used
     * @param lang
     * @returns {Observable<*>}
     */
    use(lang: string): Observable<any>;
    /**
     * Retrieves the given translations
     * @param lang
     * @returns {Observable<*>}
     */
    private retrieveTranslations(lang);
    /**
     * Gets an object of translations for a given language with the current loader
     * and passes it through the compiler
     * @param lang
     * @returns {Observable<*>}
     */
    getTranslation(lang: string): Observable<any>;
    /**
     * Manually sets an object of translations for a given language
     * after passing it through the compiler
     * @param lang
     * @param translations
     * @param shouldMerge
     */
    setTranslation(lang: string, translations: Object, shouldMerge?: boolean): void;
    /**
     * Returns an array of currently available langs
     * @returns {any}
     */
    getLangs(): Array<string>;
    /**
     * @param langs
     * Add available langs
     */
    addLangs(langs: Array<string>): void;
    /**
     * Update the list of available langs
     */
    private updateLangs();
    /**
     * Returns the parsed result of the translations
     * @param translations
     * @param key
     * @param interpolateParams
     * @returns {any}
     */
    getParsedResult(translations: any, key: any, interpolateParams?: Object): any;
    /**
     * Gets the translated value of a key (or an array of keys)
     * @param key
     * @param interpolateParams
     * @returns {any} the translated key, or an object of translated keys
     */
    get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any>;
    /**
     * Returns a stream of translated values of a key (or an array of keys) which updates
     * whenever the language changes.
     * @param key
     * @param interpolateParams
     * @returns {any} A stream of the translated key, or an object of translated keys
     */
    stream(key: string | Array<string>, interpolateParams?: Object): Observable<string | any>;
    /**
     * Returns a translation instantly from the internal state of loaded translation.
     * All rules regarding the current language, the preferred language of even fallback languages will be used except any promise handling.
     * @param key
     * @param interpolateParams
     * @returns {string}
     */
    instant(key: string | Array<string>, interpolateParams?: Object): string | any;
    /**
     * Sets the translated value of a key, after compiling it
     * @param key
     * @param value
     * @param lang
     */
    set(key: string, value: string, lang?: string): void;
    /**
     * Changes the current lang
     * @param lang
     */
    private changeLang(lang);
    /**
     * Changes the default lang
     * @param lang
     */
    private changeDefaultLang(lang);
    /**
     * Allows to reload the lang file from the file
     * @param lang
     * @returns {Observable<any>}
     */
    reloadLang(lang: string): Observable<any>;
    /**
     * Deletes inner translation
     * @param lang
     */
    resetLang(lang: string): void;
    /**
     * Returns the language code name from the browser, e.g. "de"
     *
     * @returns string
     */
    getBrowserLang(): string;
    /**
     * Returns the culture language code name from the browser, e.g. "de-DE"
     *
     * @returns string
     */
    getBrowserCultureLang(): string;
}
