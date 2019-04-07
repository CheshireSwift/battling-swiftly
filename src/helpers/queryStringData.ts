import { mergeAll } from 'ramda'

const pairsByMappingKeys = (arr: string[], f: (key: string) => string) =>
  arr ? arr.map(key => ({ [key]: f(key) })) : []

export default function queryStringData<T>({
  valueKeys = [],
  arrayKeys = [],
}: {
  valueKeys?: string[]
  arrayKeys?: string[]
}): Partial<T> {
  const urlParams = new URLSearchParams(window.location.search)
  const urlParamsGet = urlParams.get.bind(urlParams)
  const urlParamsGetAll = urlParams.getAll.bind(urlParams)

  const values = pairsByMappingKeys(valueKeys, urlParamsGet)
  const arrays = pairsByMappingKeys(arrayKeys, urlParamsGetAll)

  const results: unknown = mergeAll([...values, ...arrays])
  return results as Partial<T>
}
