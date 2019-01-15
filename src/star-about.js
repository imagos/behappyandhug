import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/paper-button/paper-button.js';
import './shared-styles-main.js';

class StarAbout extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles-main">
        :host {
            display: block;
            margin: 0px;
            padding: 0px;
            font-family: 'Roboto Condensed', sans-serif;
            line-height: 1.5;
            min-height: 90vh;
            background-repeat: no-repeat;
            background-position: center;
            background-image: url(../images/background.help.jpg);
            background-color: #17325f;
            text-align: center;
            color: #fff;
        }

        :host([hidden]) {
          display: none;
        }
        </style>
        
        <div class="container container_top">
            <div class="width_100 isotipo">
            </div>
            <div class="width_100 title-size">
                <span>Bienvenido a STAR [[nameApp]] </span>
            </div>
            <div class="width_100">
              <div class="dataEntry main_text">
                  Nuestra app que nos permitirá conocer como te sientes en la misión de transformarnos a una nueva organización Agile
              </div>
            </div>
            <div class="cards-actions">
                <paper-button class="button_verify" on-tap="_continue">CONTINUAR</paper-button>
            </div>
            <span>
            </span>
        </div>
`;
  }

  static get is() { return 'star-about'; }
  static get properties() {
      return {
        nameApp:      {type: String,  notify: true  },
        nextPage:     {type: String,    notify: true,   reflectToAttribute: true,},
      };
  }
  ready(){
    super.ready();
    db.settings({timestampsInSnapshots: true});
  }
  _continue(){
    this.nextPage='questions';
  }
}

window.customElements.define(StarAbout.is, StarAbout);
