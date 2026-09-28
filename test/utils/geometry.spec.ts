import { describe, expect, it } from 'vitest'
import { blobArcPath } from '@/utils/blobArcPath'
import { catmullRomPath } from '@/utils/catmullRomPath'
import { layoutChips } from '@/utils/chipLayout'
import { nameFitScale } from '@/utils/nameFitScale'
import { pruneTrail, ribbonOutline } from '@/utils/ribbonOutline'

describe('catmullRomPath', () => {
  it('devuelve una cadena vacía sin puntos', () => {
    expect(catmullRomPath([])).toBe('')
  })

  it('empieza en el primer punto y termina en el último', () => {
    const d = catmullRomPath([
      [0, 0],
      [100, 50],
      [200, 0],
    ])
    expect(d.startsWith('M0 0')).toBe(true)
    expect(d.endsWith('200 0')).toBe(true)
    expect(d.match(/C/g)).toHaveLength(2)
  })

  it('con un solo punto solo mueve el lápiz', () => {
    expect(catmullRomPath([[5, 7]])).toBe('M5 7')
  })
})

describe('blobArcPath', () => {
  it('agrega los márgenes al lienzo y dibuja dos arcos', () => {
    const arc = blobArcPath(400, 500, 70, -16)
    expect(arc.width).toBe(540)
    expect(arc.height).toBe(640)
    expect(arc.d.match(/A/g)).toHaveLength(2)
  })

  it('usa margen e inset por defecto', () => {
    expect(blobArcPath(100, 100).width).toBe(240)
  })
})

describe('ribbonOutline', () => {
  const points = [
    { x: 0, y: 0, t: 0 },
    { x: 10, y: 0, t: 100 },
    { x: 20, y: 0, t: 200 },
  ]

  it('produce un borde por cada punto y cierra la forma en orden inverso', () => {
    const { left, right } = ribbonOutline(points, 200, 900)
    expect(left).toHaveLength(3)
    expect(right).toHaveLength(3)
    expect(right[0]?.[0]).toBe(20)
  })

  it('la punta es más gruesa que la cola', () => {
    const { left } = ribbonOutline(points, 200, 900)
    expect(Math.abs(left[2]?.[1] ?? 0)).toBeGreaterThan(Math.abs(left[0]?.[1] ?? 0))
  })

  it('descarta los puntos vencidos', () => {
    expect(pruneTrail(points, 1050, 900)).toEqual([{ x: 20, y: 0, t: 200 }])
  })

  it('usa un ancho sin separación cuando los puntos coinciden', () => {
    const same = [
      { x: 1, y: 1, t: 0 },
      { x: 1, y: 1, t: 0 },
    ]
    expect(ribbonOutline(same, 0, 900).left[0]).toEqual([1, 1])
  })
})

describe('layoutChips', () => {
  it('reparte los chips dentro del patio de forma determinista', () => {
    const sizes = Array.from({ length: 6 }, () => ({ width: 100, height: 40 }))
    const spots = layoutChips(sizes, 1000, 470, () => 0.5)
    expect(spots).toHaveLength(6)
    expect(spots[0]).toEqual({ x: 30 + (188 - 110) / 2, y: 70 + (180 - 46) / 2, rotate: 0 })
    expect(spots[5]?.y).toBeGreaterThan(spots[0]?.y ?? 0)
  })

  it('nunca desborda aunque el chip sea más grande que su celda', () => {
    const [spot] = layoutChips([{ width: 900, height: 400 }], 300, 200, () => 1)
    expect(spot?.x).toBe(30)
    expect(spot?.y).toBe(70)
  })

  it('usa Math.random por defecto', () => {
    expect(layoutChips([{ width: 10, height: 10 }], 500, 300)).toHaveLength(1)
  })
})

describe('nameFitScale', () => {
  it('encoge el nombre para que quepa en la pantalla', () => {
    expect(nameFitScale(300, 600, [400, 380, 200], 1440)).toBeCloseTo(1116 / 1580)
  })

  it('nunca agranda el nombre', () => {
    expect(nameFitScale(0, 100, [10], 5000)).toBe(1)
  })
})
