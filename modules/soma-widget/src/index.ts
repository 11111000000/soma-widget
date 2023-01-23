import { render } from 'uland'
import SomaWidget from './soma-widget'
//@ts-ignore
import styles from './styles.module.css'

customElements.define(
  'soma-widget',
  class extends HTMLElement {
    constructor() {
      super()
      // const shadow = this.attachShadow({ mode: 'open' })
      this.classList.add(styles.element)
      this.render()
    }

    render() {
      const tokenId = this.getAttribute('tokenId')
      const beginTimestamp = Number(this.getAttribute('beginTimestamp'))
      if (tokenId && beginTimestamp) {
        render(
          this,
          SomaWidget({
            beginTimestamp,
            tokenId,
            gradientColor: this.getAttribute('gradientColor') || undefined,
            strokeColor: this.getAttribute('strokeColor') || undefined,
            endTimestamp: Number(
              this.getAttribute('endTimestamp') || undefined
            ),
            element: this,
          })
        )
      } else {
        console.log('Please set tokenId and beginTimestamp attributes')
      }
    }

    static get observedAttributes() {
      return ['gradientColor', 'strokeColor', 'currency', 'dateFrom', 'dateTo']
    }

    attributeChangedCallback() {
      this.render()
      // if (attr === 'gradientColor') {
      //   render(this, SomaWidget({ gradientColor: curr }))
      // }
    }
  }
)
