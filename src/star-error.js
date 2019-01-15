import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import './shared-styles-main.js';

class StarError extends GestureEventListeners(PolymerElement) {
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
            text-align: center;
            color: #fff;
        }
        .header_image {
          background-image: url(../images/background.problems.jpg);
        }
        :host([hidden]) {
          display: none;
        }
        .transbox {
          background-color: rgba(9,63,100,0.5);
          height: 90vh;
        }
        </style>
        
        <div class="container transbox header_image">
          <div class="container_top">
            <div class="width_100 title-size title-margin-bottom ">
                ¡OOPS!
            </div>
            <div class="width_100">
              <div class="dataEntry">
                Nos hemos encontrado con un campo de asteriodes que no permite completar la misión.
                <br><br>
                [[message]]
              </div>
            </div>
          </div>
        </div>
`;
  }

  static get is() { return 'star-error'; }
  static get properties() {
      return {
        nextPage:       {type: String,    notify: true,   reflectToAttribute: true,},
        message:        {type: String,    notify: true,   reflectToAttribute: true,},
      };
  }
  ready(){
    super.ready();
    db.settings({timestampsInSnapshots: true});
    console.log(this.message);
  }
}

window.customElements.define(StarError.is, StarError);
