export declare abstract class TranslateCompiler {
    abstract compile(value: string, lang: string): string | Function;
    abstract compileTranslations(translations: any, lang: string): any;
}
/**
 * This compiler is just a placeholder that does nothing, in case you don't need a compiler at all
 */
export declare class TranslateFakeCompiler extends TranslateCompiler {
    compile(value: string, lang: string): string | Function;
    compileTranslations(translations: any, lang: string): any;
}
