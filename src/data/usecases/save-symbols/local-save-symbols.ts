import { CacheStore } from '@/data/protocols/cache';

export class LocalSaveSymbols {
  constructor(private readonly cacheStore: CacheStore) {}

  async save(): Promise<void> {
    this.cacheStore.delete('symbols');
  }
}
