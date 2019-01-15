import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import './shared-styles-main.js';

class StarValidate extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles-main">
        :host {
          display: block;
          font-family: 'Roboto Condensed', sans-serif;
          text-align: center !important;
          min-height: 90vh;
          color: #fff;
        }
        .header_image {
          background-image: url(../images/background.validate.jpg);
        }
        :host([hidden]) {
          display: none;
        }
        .transbox {
          background-color: rgba(9,63,100,0.5);
          height: 90vh;
        }
        </style>
        
        <div class="container header_image transbox">
          <div class="container_top">
            <div class="width_100 title-size title-margin-bottom ">
              VALIDANDO MISIÓN >>
            </div>            
            <div class="width_100">
              <div class="dataEntry">
                Identíficate ingresando al correo que acabas de recibir y dale clic al enlace para verificar tu identidad.
              </div>
            </div>
          </div>
        </div>
`;
  }

  static get is() { return 'star-validate'; }
  static get properties() {
      return {
        nextPage:       {type: String,    notify: true,   reflectToAttribute: true,},
      };
  }
  ready(){
    super.ready();
    db.settings({timestampsInSnapshots: true});
  }
}

window.customElements.define(StarValidate.is, StarValidate);
