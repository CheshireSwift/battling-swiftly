import { ignoreZoom } from './styleSnippets'

describe('style snippets', () => {
  describe('#ignoreZoom', () => {
    ;(global as any).window.devicePixelRatio = 0.5

    it('undoes the multiplier added by device pixels', () => {
      expect(ignoreZoom({ width: 20 })).toEqual({ width: 40 })
    })

    it('ignores non-number props', () => {
      expect(ignoreZoom({ width: '100%' })).toEqual({ width: '100%' })
    })

    it('treats strings ending in px as nubers', () => {
      expect(ignoreZoom({ width: '20px' })).toEqual({ width: '40px' })
    })
  })
})
