import * as React from 'react'
import { mount } from 'enzyme'

import QueryString from './QueryString'

describe('query string binding', () => {
  it('passes the requested values to its children', () => {
    // given
    jsdom.reconfigure({
      url: 'http://example.com/?a=1&b=2&c=3',
    })

    // when
    const qsElem = mount(
      <QueryString<{ a: string; c: string }> valueKeys={['a', 'c']}>
        {data => `Called with ${data.a} and ${data.c}`}
      </QueryString>,
    )

    // then
    expect(qsElem.text()).toContain('Called with 1 and 3')
  })
})
