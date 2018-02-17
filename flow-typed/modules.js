// @flow

export type Model = {filePath: string, globalName: string, name: string, url: string, version: string};
export type Options = {cdn: {[name: string]: $Exact<{name: string, url: string | Array<string>}> | $Exact<{css: string | Array<string>, js: string | Array<string>, name: string}>}, exclude: string | Array<string>, include: string | Array<string>, report: boolean};
declare export default class {

  options: {cdn: {[name: string]: $Exact<{name: string, url: string | Array<string>}> | $Exact<{css: string | Array<string>, js: string | Array<string>, name: string}>}, exclude: string | Array<string>, include: string | Array<string>, report: boolean};
  apply(compiler: any): void;
  constructor(options: {cdn: {[name: string]: $Exact<{name: string, url: string | Array<string>}> | $Exact<{css: string | Array<string>, js: string | Array<string>, name: string}>}, exclude: string | Array<string>, include: string | Array<string>, report: boolean}): void;
}

