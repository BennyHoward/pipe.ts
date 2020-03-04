(function (root, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
      var v = factory(require, exports);
      if (v !== undefined) module.exports = v;
  }
  else if (typeof define === "function" && define.amd) {
      define(["require", "exports"], factory);
  } else {
      const module = {exports: {}};
      const exports = module.exports;
      var v = factory(void 0, exports);
      if (v !== undefined) module.exports = v;
      root.pipe = module.exports.pipe;
  }
})(this, function (require, exports) {
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var PIPE_PARAM_PLACEHOLDER = Symbol('Pipe Param Placeholder');
var PIPE_PREVIOUS_RESULT_PLACEHOLDER = Symbol('Pipe Previous Return Placeholder');
function pipeFactory(callstack) {
    var pipe = function (fn) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var pipeHandler = function () {
            var pipeArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                pipeArgs[_i] = arguments[_i];
            }
            var argIndexCount = -1;
            return pipeHandler.callstack.reduce(function (prevResult, currentCallstackItem) {
                return currentCallstackItem.fn.apply(undefined, currentCallstackItem.args.map(function (a) {
                    switch (a) {
                        case PIPE_PREVIOUS_RESULT_PLACEHOLDER:
                            return prevResult;
                        case PIPE_PARAM_PLACEHOLDER:
                            argIndexCount++;
                            return pipeArgs[argIndexCount];
                        default:
                            throw new Error('Unknown pipe argument.  Use `pipe.$` to indicate a parameter and `pipe._` to indicate the previous result.');
                    }
                }));
            }, undefined);
        };
        pipeHandler.callstack = __spreadArrays(callstack, [{ fn: fn, args: args }]);
        pipeHandler.pipe = pipeFactory(pipeHandler.callstack);
        return pipeHandler;
    };
    pipe.$ = PIPE_PARAM_PLACEHOLDER;
    pipe._ = PIPE_PREVIOUS_RESULT_PLACEHOLDER;
    return pipe;
}
exports.pipe = pipeFactory([]);

});
//# sourceMappingURL=pipe.js.map
