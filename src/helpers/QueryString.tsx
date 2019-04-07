import * as React from 'react'
import { mergeAll } from 'ramda'

type QueryStringProps<T> = {
  valueKeys?: string[]
  arrayKeys?: string[]
  children: (data: Partial<T>) => React.ReactNode
}

const pairsByMappingKeys = (arr: string[], f: (key: string) => string) =>
  arr ? arr.map(key => ({ [key]: f(key) })) : []

export class QueryString<T> extends React.Component<QueryStringProps<T>> {
  render() {
    const urlParams = new URLSearchParams(window.location.search)
    const urlParamsGet = urlParams.get.bind(urlParams)
    const urlParamsGetAll = urlParams.getAll.bind(urlParams)

    const values = pairsByMappingKeys(this.props.valueKeys, urlParamsGet)
    const arrays = pairsByMappingKeys(this.props.arrayKeys, urlParamsGetAll)

    const results: unknown = mergeAll([...values, ...arrays])
    return this.props.children(results as Partial<T>)
  }
}

export default QueryString
