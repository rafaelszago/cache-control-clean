import { CacheStore } from '@/data/protocols/cache'
import { SaveSymbols } from '@/domain/usecases'

export class LocalSaveSymbols {
  constructor(
    private readonly cacheStore: CacheStore,
    private readonly timestamp: Date,
  ) {}

  async save(symbols: Array<SaveSymbols.Params>): Promise<void> {
    this.cacheStore.replace('symbols', {
      timestamp: this.timestamp,
      data: symbols,
    })
  }
}
