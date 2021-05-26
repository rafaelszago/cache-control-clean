import { CacheStore } from '@/data/protocols/cache'
import { LocalSaveSymbols } from '@/data/usecases'
import { SaveSymbols } from '@/domain'

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  insertCallsCount = 0
  deleteKey: string
  insertKey: string
  insertValues: Array<SaveSymbols.Params> = []

  delete(key: string): void {
    this.deleteCallsCount++
    this.deleteKey = key
  }

  insert(key: string, value: any): void {
    this.insertCallsCount++
    this.insertKey = key
    this.insertValues = value
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      throw new Error()
    })
  }
}

const mockSymbols = (): Array<SaveSymbols.Params> => [
  {
    id: '1',
    name: 'Bitcoin',
    slug: 'BTC',
  },
  {
    id: '1',
    name: 'Ethereum',
    slug: 'ETH',
  },
]

type SutTypes = {
  sut: LocalSaveSymbols
  cacheStore: CacheStoreSpy
}

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSaveSymbols(cacheStore)
  return { cacheStore, sut }
}

describe('LocalSaveSymbols', () => {
  test('Should not delete cache on sut.ini', () => {
    const { cacheStore } = makeSut()
    new LocalSaveSymbols(cacheStore)
    expect(cacheStore.deleteCallsCount).toBe(0)
  })

  test('Should delete old cache on sut.save', async () => {
    const { cacheStore, sut } = makeSut()
    await sut.save(mockSymbols())
    expect(cacheStore.deleteCallsCount).toBe(1)
  })

  test('Should call delete with correct key', async () => {
    const { cacheStore, sut } = makeSut()
    await sut.save(mockSymbols())
    expect(cacheStore.deleteKey).toBe('symbols')
  })

  test('Should not insert new cache if delete fails', () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.simulateDeleteError()
    const promise = sut.save(mockSymbols())
    expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow()
  })

  test('Should insert new cache if delete succeeds', async () => {
    const { cacheStore, sut } = makeSut()
    const symbols = mockSymbols()

    await sut.save(symbols)

    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.insertKey).toBe('symbols')
    expect(cacheStore.insertValues).toEqual(symbols)
  })
})
