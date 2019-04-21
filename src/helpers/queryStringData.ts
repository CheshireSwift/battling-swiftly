import * as _ from 'lodash'

type StringDict<T> = { [P in keyof T]?: string }
type ArrayStringDict<T> = { [P in keyof T]?: string[] }

const pairsByMappingKeys = <T, R>(
  arr: Array<keyof T>,
  f: (key: keyof T) => R,
) => (arr ? arr.map(key => [key, f(key)] as [keyof T, R]) : [])

export default function queryStringData<T>({
  valueKeys = [],
  arrayKeys = [],
}: {
  valueKeys?: Array<keyof T>
  arrayKeys?: Array<keyof T>
}): { values: StringDict<T>; arrays: ArrayStringDict<T> } {
  const urlParams = new URLSearchParams(window.location.search)
  const urlParamsGet: (key: keyof T) => string | null = urlParams.get.bind(
    urlParams,
  )
  const urlParamsGetAll: (key: keyof T) => string[] = urlParams.getAll.bind(
    urlParams,
  )

  const values = pairsByMappingKeys(valueKeys, urlParamsGet)
  const arrays = pairsByMappingKeys(arrayKeys, urlParamsGetAll)

  return { values: _.fromPairs(values), arrays: _.fromPairs(arrays) } as {
    values: StringDict<T>
    arrays: ArrayStringDict<T>
  }
}
