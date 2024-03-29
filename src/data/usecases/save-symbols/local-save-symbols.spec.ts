import { mockSymbols, CacheStoreSpy } from '@/data/tests'
import { LocalSaveSymbols } from '@/data/usecases'

type SutTypes = {
  sut: LocalSaveSymbols
  cacheStore: CacheStoreSpy
}

const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSaveSymbols(cacheStore, timestamp)
  return { cacheStore, sut }
}

describe('LocalSaveSymbols', () => {
  test('Should not delete or insert cache on sut.ini', () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.actions).toEqual([])
  })

  test('Should not insert new cache if delete fails', async () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.simulateDeleteError()
    const promise = sut.save(mockSymbols())
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete])
    await expect(promise).rejects.toThrow()
  })

  test('Should insert new cache if delete succeeds', async () => {
    const timestamp = new Date()
    const { cacheStore, sut } = makeSut()
    const symbols = mockSymbols()
    const promise = sut.save(symbols)
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.delete,
      CacheStoreSpy.Action.insert,
    ])
    expect(cacheStore.deleteKey).toBe('symbols')
    expect(cacheStore.insertKey).toBe('symbols')
    expect(cacheStore.insertValues).toEqual({
      timestamp,
      data: symbols,
    })
    await expect(promise).resolves.toBeFalsy()
  })

  test('Should throw error if insert fails', async () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.simulateInsertError()
    const promise = sut.save(mockSymbols())
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.delete,
      CacheStoreSpy.Action.insert,
    ])
    await expect(promise).rejects.toThrow()
  })
})
