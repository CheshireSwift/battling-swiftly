import queryStringData from './queryStringData'

describe('query string data', () => {
  it('returns the requested values', () => {
    jsdom.reconfigure({
      url: 'http://example.com/?a=1&b=2&c=3',
    })

    expect(queryStringData({ valueKeys: ['a', 'c'] }).values).toEqual({
      a: '1',
      c: '3',
    })
  })

  it('returns the requested arrays', () => {
    jsdom.reconfigure({
      url: 'http://example.com/?a=1&a=2&c=3',
    })

    expect(queryStringData({ arrayKeys: ['a', 'b', 'c'] }).arrays).toEqual({
      a: ['1', '2'],
      b: [],
      c: ['3'],
    })
  })
})
