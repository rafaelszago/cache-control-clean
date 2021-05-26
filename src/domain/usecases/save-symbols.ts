export interface SaveSymbols {
  list: (symbols: Array<SaveSymbols.Params>) => Promise<void>;
}

namespace SaveSymbols {
  export type Params = {
    id: string;
    name: string;
    slug: string;
  };
}
