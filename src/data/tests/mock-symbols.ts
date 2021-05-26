import { SaveSymbols } from '@/domain/usecases'
import faker from 'faker'

export const mockSymbols = (): Array<SaveSymbols.Params> => [
  {
    id: faker.random.alphaNumeric(),
    name: faker.finance.currencySymbol(),
    slug: faker.finance.currencySymbol(),
  },
  {
    id: faker.random.alphaNumeric(),
    name: faker.finance.currencySymbol(),
    slug: faker.finance.currencySymbol(),
  },
]
