type CallstackType<F extends Function = Function> = {
  fn: F;
  args: symbol[];
};

type PipeFunctionType<F extends Function = Function, R = any> = {
  (fn: F, ...args: symbol[]): R;
  $: symbol;
  _: symbol;
};

const PIPE_PARAM_PLACEHOLDER: unique symbol = Symbol('Pipe Param Placeholder');
const PIPE_PREVIOUS_RESULT_PLACEHOLDER: unique symbol = Symbol(
  'Pipe Previous Return Placeholder',
);

function pipeFactory<F extends Function = Function, R = any>(
  callstack: CallstackType[],
): PipeFunctionType {
  const pipe: PipeFunctionType = function(fn: F, ...args: symbol[]) {
    const pipeHandler = (...pipeArgs: symbol[]): R => {
      let argIndexCount: number = -1;
      return pipeHandler.callstack.reduce(
        (prevResult, currentCallstackItem) =>
          currentCallstackItem.fn.apply(
            undefined,
            currentCallstackItem.args.map((a: symbol) => {
              switch (a) {
                case PIPE_PREVIOUS_RESULT_PLACEHOLDER:
                  return prevResult;
                case PIPE_PARAM_PLACEHOLDER:
                  argIndexCount++;
                  return pipeArgs[argIndexCount];
                default:
                  throw new Error(
                    'Unknown pipe argument.  Use `pipe.$` to indicate a parameter and `pipe._` to indicate the previous result.',
                  );
              }
            }),
          ),
        undefined,
      );
    };
    pipeHandler.callstack = [...callstack, { fn, args }];
    pipeHandler.pipe = pipeFactory(pipeHandler.callstack);
    return pipeHandler;
  };
  pipe.$ = PIPE_PARAM_PLACEHOLDER;
  pipe._ = PIPE_PREVIOUS_RESULT_PLACEHOLDER;
  return pipe;
}

export const pipe: PipeFunctionType = pipeFactory([]);
