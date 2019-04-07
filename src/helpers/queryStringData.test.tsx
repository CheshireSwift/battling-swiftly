import queryStringData from './queryStringData'

describe('query string data', () => {
  it('returns the requested values', () => {
    jsdom.reconfigure({
      url: 'http://example.com/?a=1&b=2&c=3',
    })

    expect(queryStringData({ valueKeys: ['a', 'c'] })).toEqual({
      a: '1',
      c: '3',
    })
  })
})
