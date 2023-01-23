import { Component, html, IRenderer } from 'uland'
//@ts-ignore
import styles from './styles.module.css'
import { formatCurrency } from './math'

const changeIcon = (
  color: string,
  direction: string,
  style: string
): IRenderer => {
  return html`
    <svg
      height="50"
      width="50"
      style="${style || ''}"
      transform="${direction == 'up' ? 'scale(1, 1)' : 'scale(1, -1)'}"
    >
      <polygon points="0,0 50,50 50,0" style="${`fill: ${color}`}" />
    </svg>
  `
}

export const SomaVolume = ({
  title,
  value,
  change,
  incColor = '#65B2BF',
  decColor = '#D87E84',
  changeFontSize = '0.6em',
}: {
  title?: string
  value: number
  change?: number
  incColor?: string
  decColor?: string
  changeFontSize?: string
}): IRenderer => {
  const indicatorColor: string = change && change > 0 ? incColor : decColor
  const changeStyle: string = `
      color: ${indicatorColor};
      font-size: ${changeFontSize}
    `

  return html`
    <div class="${styles.somaVolume}">
      <div class="${styles.somaVolumeValueContainer}">
        <div class="${styles.somaVolumeValue}">
          <span class="${styles.somaVolumeSign}">$</span>
          ${formatCurrency(value)}
        </div>
        <div class="${styles.somaVolumeChange}" style=${changeStyle}>
          ${changeIcon(
            indicatorColor,
            change && change > 0 ? 'up' : 'down',
            'width: .6em; height: .6em; margin-right: .3em;'
          )}
          ${change ? Math.abs(change).toFixed(2) + '%' : ''}
        </div>
      </div>
      <div class="${styles.somaVolumeTitle}">${title}</div>
    </div>
  `
}

export default SomaVolume
