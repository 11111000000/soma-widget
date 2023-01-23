import { format } from 'light-date'
//@ts-ignore
import numerify from 'numerify'

export interface Point {
  x: number
  y: number
}

export function catmullRom2bezier(points: Point[]): Point[][] {
  var result: Point[][] = []

  if (points.length < 3) {
    return []
  } else {
    for (var i = 0; i < points.length - 1; i++) {
      var p: Array<Point> = []

      p.push({
        x: points[Math.max(i - 1, 0)].x,
        y: points[Math.max(i - 1, 0)].y,
      })
      p.push({
        x: points[i].x,
        y: points[i].y,
      })
      p.push({
        x: points[i + 1].x,
        y: points[i + 1].y,
      })
      p.push({
        x: points[Math.min(i + 2, points.length - 1)].x,
        y: points[Math.min(i + 2, points.length - 1)].y,
      })

      // Catmull-Rom to Cubic Bezier conversion matrix
      //    0       1       0       0
      //  -1/6      1      1/6      0
      //    0      1/6      1     -1/6
      //    0       0       1       0

      let bp: Point[] = []

      bp.push({
        x: (-p[0].x + 6 * p[1].x + p[2].x) / 6,
        y: (-p[0].y + 6 * p[1].y + p[2].y) / 6,
      })
      bp.push({
        x: (p[1].x + 6 * p[2].x - p[3].x) / 6,
        y: (p[1].y + 6 * p[2].y - p[3].y) / 6,
      })
      bp.push({
        x: p[2].x,
        y: p[2].y,
      })
      result.push(bp)
    }
  }

  return result
}

export function makePath(points: Array<Point>): string {
  if (points.length < 3) {
    return 'M 0,0'
  } else {
    let result: string = 'M' + points[0].x + ',' + points[0].y + ' '
    let catmull: Point[][] = catmullRom2bezier(points)
    for (var i = 0; i < catmull.length; i++) {
      result +=
        'C' +
        catmull[i][0].x +
        ',' +
        catmull[i][0].y +
        ' ' +
        catmull[i][1].x +
        ',' +
        catmull[i][1].y +
        ' ' +
        catmull[i][2].x +
        ',' +
        catmull[i][2].y +
        ' '
    }
    return result
  }
}

export const arrayAbsMax = (array: number[]): number =>
  Math.max.apply(Math, array.map(Math.abs))

export function graphToPoints(
  graph: number[],
  weight: number,
  height: number
): Point[] {
  const max: number = arrayAbsMax(graph)
  var points: Point[] = []

  if (graph.length < 3) {
    return []
  }

  for (var i = 0; i < graph.length; i++) {
    let point: Point = {
      x: i * (weight / (graph.length - 1)),
      y: graph[i] * (height / max / 3) * -1 + height / 2,
    }

    points.push(point)
  }
  return points
}

export function hashCode(s: string) {
  return s.split('').reduce(function (a: number, b: string) {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)
}

export function formatDate(date: Date | undefined) {
  if (date) {
    return format(date, '{HH}:{mm} EDT on {dd}.{MM}.{yyyy}')
  } else {
    return ''
  }
}

export function formatCurrency(value: number): string {
  // return new Intl.NumberFormat('en-UK', {
  //   style: 'currency',
  //   currency: 'USD',
  //   notation: 'compact',
  // }).format(value)
  return numerify(value, '0.00a')
}
