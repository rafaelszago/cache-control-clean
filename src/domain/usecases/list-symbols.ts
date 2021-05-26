export interface ListSymbols {
  list: (symbols: Array<ListSymbols.Params>) => Promise<void>;
}

namespace ListSymbols {
  export type Params = {
    id: string;
    name: string;
    slug: string;
  };
}
