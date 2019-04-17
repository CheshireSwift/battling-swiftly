import * as React from 'react'

import { useLocalStorage } from '../helpers/hooks'

const initialOptions = { fixedScale: null as number | null }

type GlobalOptions = typeof initialOptions
export type OptionKey = keyof GlobalOptions
export type SetOption = <K extends OptionKey>(
  option: K,
  value: GlobalOptions[K],
) => void

export function useOptions() {
  const [optionsJson, setOptionsJson] = useLocalStorage(
    JSON.stringify(initialOptions),
  )
  const options = optionsJson ? JSON.parse(optionsJson) : initialOptions
  const setOption: SetOption = (option, value) =>
    setOptionsJson(
      JSON.stringify({ ...initialOptions, ...options, [option]: value }),
    )

  return [options, setOption] as [GlobalOptions, SetOption]
}

export const Options = React.createContext(initialOptions)

export default Options
