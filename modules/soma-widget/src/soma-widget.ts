import {
  Component,
  html,
  useState,
  useEffect,
  useRef,
  useMemo,
  svg,
} from 'uland'

import { TokensV2Api } from 'dex-api/src/apis/TokensV2Api'
import { RestTokenHistory } from 'dex-api/src/models/RestTokenHistory'
import { Configuration } from 'dex-api/src/runtime'
import { makePath, graphToPoints, Point, hashCode, formatDate } from './math'
//@ts-ignore
import styles from './styles.module.css'
import logoSvg from './logo.svg'
import SomaVolume from './soma-volume'
import CurrencyLogo from './currency-logo'

const tokensApi = new TokensV2Api(
  new Configuration({
    basePath: 'https://api.dex.guru',
    middleware: [],
  })
)

export function calcChange(
  parameter: keyof RestTokenHistory,
  curr: RestTokenHistory,
  prev: RestTokenHistory
): number {
  const currentValue = Number(curr[parameter])
  const previousValue = Number(prev[parameter])
  return (100 * (currentValue - previousValue)) / previousValue
}

export const SomaWidget = Component(
  ({
    element,
    tokenId,
    beginTimestamp,
    endTimestamp,
    gradientColor = '#252366',
    strokeColor = '#65B2BF',
    backgroundColor = '#181D23',
  }: {
    element: HTMLElement
    tokenId: string
    beginTimestamp: number
    endTimestamp?: number
    gradientColor?: string
    strokeColor?: string
    backgroundColor?: string
  }) => {
    const currentTime = new Date().getTime()

    const [width, setWidth] = useState(element.clientWidth)

    const containerElement: MutableRefObject<HTMLElement | undefined> = useRef()

    const [data, setData]: [RestTokenHistory[], Function] = useState([])

    const [selectedIndex, setSelectedIndex]: [number, Function] = useState(0)

    const selected: RestTokenHistory | undefined = data[selectedIndex]

    const previous: RestTokenHistory | undefined = data[selectedIndex - 1]

    const selectedDate: Date | undefined = selected?.date
      ? new Date(selected.date * 1000)
      : undefined

    const height = width * 0.53

    const baseFontSize = `${height * 0.1}px`

    const gradientId = `gradiend-${hashCode(gradientColor)}`

    const points = useMemo(
      () =>
        graphToPoints(
          data.map(it => it.priceETH || 0),
          width,
          height
        ),
      [data, width, height]
    )

    const currencyLogo = useMemo(() => CurrencyLogo(data[0]?.network), [data])

    const path = useMemo(() => makePath(points), [points])

    const selectedPoint: Point | undefined = points[selectedIndex]

    function mouseMove(event: { clientX: number }) {
      const rect = containerElement.current?.getBoundingClientRect()
      if (rect) {
        const x = event.clientX - rect.left
        const k = width / data.length
        const index: number = Math.floor(x / k)
        if (index > 0 && index < data.length) {
          if (index !== selectedIndex) {
            setSelectedIndex(index)
          }
        }
      }
    }

    useEffect(() => {
      tokensApi
        .getTokensHistoryV2TokensTokenIdHistoryGet({
          beginTimestamp: beginTimestamp,
          endTimestamp: endTimestamp || Math.floor(currentTime / 1000),
          tokenId: tokenId,
        })
        .then(it => {
          if (it.data) {
            setData(it.data)
            // updatePath(it.data)
            setSelectedIndex(it.data.length - 1)
          }
        })
    }, [])

    useEffect(() => {
      const observer = new ResizeObserver(() => {
        window.requestAnimationFrame(() => {
          if (width !== element.clientWidth) {
            setWidth(element.clientWidth)
          }
        })
      })
      observer.observe(element)
    }, [])

    if (!data || data.length < 3) {
      return html`
        <div>loading...</div>
      `
    } else {
      return html`
        <div
          class="${styles.container}"
          onmousemove=${mouseMove}
          ref=${containerElement}
          style="${`background-color: ${backgroundColor}; font-size:${baseFontSize}`}"
        >
          <a href="//" class="${styles.logo}">${logoSvg()}</a>
          <div class="${styles.currencyLogo}">${currencyLogo}</div>
          <div class="${styles.selectedPrice}">
            ${SomaVolume({
              value: selected.priceUSD || 0,
              change: calcChange('priceUSD', selected, previous),
              changeFontSize: '0.4em',
            })}
          </div>
          <div class="${styles.time}">${formatDate(selectedDate)}</div>
          <div class="${styles.liquidity}">
            ${SomaVolume({
              title: 'Liquidity',
              value: selected.totalLiquidityUSD || 0,
              change: calcChange('totalLiquidityUSD', selected, previous),
            })}
          </div>
          <div class="${styles.tradingVolume}">
            ${SomaVolume({
              title: 'Trading Volume',
              value: selected.dailyVolumeUSD || 0,
              change: calcChange('dailyVolumeUSD', selected, previous),
            })}
          </div>
          <svg height="${height}" width="${width}" class="${styles.chart}">
            <defs>
              <linearGradient id="${gradientId}" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="${gradientColor}" />
                <stop
                  offset="100%"
                  stop-color="${gradientColor}"
                  stop-opacity="0"
                />
              </linearGradient>
            </defs>
            <path
              d="${path +
                ` L${width + 10},${height / 2}  L${width + 2},${height +
                  2} L-2,${height + 2}`}"
              stroke="${strokeColor}"
              stroke-width="2"
              fill="${`url(#${gradientId})`}"
            />
            ${selectedPoint
              ? svg`<circle
                      cx="${selectedPoint.x}"
                      cy="${selectedPoint.y}"
                      r="2"
                      fill="lightgreen"
                    />`
              : ''}
          </svg>
        </div>
      `
    }
  }
)

export default SomaWidget
