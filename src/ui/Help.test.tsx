import * as React from 'react'
import { render } from 'enzyme'

import Help from './Help'
describe('the help display', () => {
  it('matches the snapshot', () => {
    expect(
      render(<Help show={true} setOption={jest.fn()} onClose={jest.fn()} />),
    ).toMatchSnapshot()
  })

  it('hides when not shown', () => {
    expect(
      render(<Help show={false} setOption={jest.fn()} onClose={jest.fn()} />)
        .length,
    ).toBe(0)
  })

  it('displays some content when shown', () => {
    expect(
      render(<Help show={true} setOption={jest.fn()} onClose={jest.fn()} />)
        .length,
    ).toBeGreaterThan(0)
  })
})
