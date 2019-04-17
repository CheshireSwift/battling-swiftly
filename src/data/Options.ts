import * as React from 'react'

const initialOptions = { fixedScale: null as number | null }
type GlobalOptions = typeof initialOptions
export type OptionKey = keyof GlobalOptions
export type SetOption = <K extends OptionKey>(
  option: K,
  value: GlobalOptions[K],
) => void

export function useOptions() {
  const [state, dispatch] = React.useReducer(
    <K extends OptionKey>(
      state: GlobalOptions,
      action: { type: K; value: GlobalOptions[K] },
    ) => ({ ...state, [action.type]: action.value }),
    initialOptions,
  )

  return [
    state,
    (option, value) =>
      dispatch({
        type: option,
        value,
      }),
  ] as [GlobalOptions, SetOption]
}
export const Options = React.createContext(initialOptions)

export default Options
