import { html } from 'uland'

export function CurrencyLogo(networkName: string | undefined): string {
  if (!networkName)
    return html`
      ...
    `
  return (
    {
      eth: html`
        ETH
      `,
      dodge: html`
        DOGE
        <span style="color: orange;">BLABLA</span>
      `,
    }[networkName] || html``
  )
}

export default CurrencyLogo
