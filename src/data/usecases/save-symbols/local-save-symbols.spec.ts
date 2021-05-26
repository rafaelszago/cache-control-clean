import { CacheStore } from '@/data/protocols/cache'
import { LocalSaveSymbols } from '@/data/usecases'

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  insertCallsCount = 0
  key: string

  delete(key: string): void {
    this.deleteCallsCount++
    this.key = key
  }
}

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
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
  })

  test('Should call delete with correct key', async () => {
    const { cacheStore, sut } = makeSut()
    await sut.save()
    expect(cacheStore.key).toBe('symbols')
  })

  test('Should not insert new cache if delete fails', () => {
    const { cacheStore, sut } = makeSut()
    jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.save()
    expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow()
  })
})
