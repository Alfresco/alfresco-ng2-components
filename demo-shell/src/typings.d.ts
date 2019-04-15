/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
    id: string;
}

interface Window {
    define: (name: string, deps: string[], definitionFn: () => any) => void;

    System: {
        import: (path) => Promise<any>;
    };
}
