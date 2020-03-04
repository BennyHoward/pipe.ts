declare type PipeFunctionType<F extends Function = Function, R = any> = {
    (fn: F, ...args: symbol[]): R;
    $: symbol;
    _: symbol;
};
export declare const pipe: PipeFunctionType;
export {};
