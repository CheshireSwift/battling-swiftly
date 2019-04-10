import * as _ from 'lodash'

const pairsByMappingKeys = <T>(
  arr: Array<keyof T>,
  f: (key: keyof T) => string,
) => (arr ? arr.map(key => [key, f(key)] as [keyof T, string]) : [])

export default function queryStringData<T>({
  valueKeys = [],
  arrayKeys = [],
}: {
  valueKeys?: Array<keyof T>
  arrayKeys?: Array<keyof T>
}): Partial<T> {
  const urlParams = new URLSearchParams(window.location.search)
  const urlParamsGet = urlParams.get.bind(urlParams)
  const urlParamsGetAll = urlParams.getAll.bind(urlParams)

  const values = pairsByMappingKeys(valueKeys, urlParamsGet)
  const arrays = pairsByMappingKeys(arrayKeys, urlParamsGetAll)

  const results: unknown = _.fromPairs([...values, ...arrays])
  return results as Partial<T>
}
