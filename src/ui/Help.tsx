import * as React from 'react'
import * as _ from 'lodash'

import { cPrimary, cMenuBg } from '../styling/constants'
import Options, { SetOption, initialOptions } from '../data/Options'
import customColorOptions from "../graphics/customColorOptions";

export const Help = ({
  show,
  setOption,
  onClose,
}: {
  show: boolean
  setOption: SetOption
  onClose: () => void
}) => {
  const options = React.useContext(Options)
  return show ? (
    <div
      style={{
        position: 'fixed',
        top: '10%',
        left: '25%',
        width: '50%',
        color: cPrimary,
        background: cMenuBg,
        border: `1px solid ${cPrimary}`,
        padding: '0 2rem',
        fontSize: 18,
      }}
    >
      <h1 style={{ textAlign: 'center' }}>Help and Options</h1>
      <button
        style={{
          position: 'absolute',
          top: -1,
          right: -1,
          border: `1px solid ${cPrimary}`,
          background: 'none',
          color: cPrimary,
          fontSize: 18,
          padding: '0.1rem',
        }}
        onClick={onClose}
      >
        ╳
      </button>
      <ul>
        <li>
          Scale
          <input
            style={{
              margin: '1rem',
              background: 'black',
              border: `1px solid ${cPrimary}`,
              color: cPrimary,
              fontFamily: 'monospace',
            }}
            type="number"
            value={
              _.isFinite(options.fixedScale)
                ? (options.fixedScale as number)
                : ''
            }
            min="0"
            max="5"
            step="0.5"
            onChange={e => setOption('fixedScale', e.target.valueAsNumber)}
            placeholder="Variable"
          />
        </li>
        <li>
          Plotting colour
          <select
            style={{
              margin: '1rem',
              background: 'black',
              border: `1px solid ${cPrimary}`,
              color: cPrimary,
              fontFamily: 'monospace',
            }}
            value={options.drawColour}
            onChange={e =>
              setOption(
                'drawColour',
                e.target.value || initialOptions.drawColour,
              )
            }
          >
            {Object.entries(customColorOptions).map(([key, value]) => {
              return (
                <option
                  key={key}
                  value={value}
                  style={{
                    color: `${value}`
                  }}
                >{key}</option>
              )
            })}
          </select>
        </li>
      </ul>
    </div>
  ) : null
}

export default Help
