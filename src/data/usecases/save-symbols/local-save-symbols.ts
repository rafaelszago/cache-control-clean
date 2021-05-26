import { CacheStore } from '@/data/protocols/cache'
import { SaveSymbols } from '@/domain'

export class LocalSaveSymbols {
  constructor(private readonly cacheStore: CacheStore) {}

  async save(symbols: Array<SaveSymbols.Params>): Promise<void> {
    this.cacheStore.delete('symbols')
    this.cacheStore.insert('symbols', symbols)
  }
}
