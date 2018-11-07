import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/paper-button/paper-button.js';

class QuestionDetail extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
        <style>
        /* Font families */
        --lumo-font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe 
        /* Font sizes */
        --lumo-font-size-s: .875rem;
        :host {
            display: block;
            font-family: var(--lumo-font-family);
        }
        .paper-header {
          height: 60px;
          font-size: 16px;
          line-height: 60px;
          padding: 0 10px;
          color: white;
          transition: height 0.2s;
          background-color: #FFCC28 !important;
          border-radius: 5px;
        }
            
        .card {
            margin: 8px;
            padding: 8px;
            color: #757575;
            border-radius: 5px;
            background-color: #fff;
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
        .kudo_base{
          width: 40px; /*or your image's width*/
          height: 40px; /*or your image's height*/
          /*margin: 10px !important;*/
          background-repeat: no-repeat;
          background-color: #cccccc;
          background-repeat: no-repeat;
          background-position: center;
          background-size: 50px 50px;
          border: 1px solid #009ee5;
          cursor: pointer;
          padding: 8px;
          border-radius: 10px;
          background-color: #cccccc;
          display: inline-block;
        }
        .kudo_enable{
          background-color: #82c82d;
        }
        .kudo_disable{
          background-color: #cccccc;
        }
        .kudo_title{
          margin: 5px !important;
          font-size: var(--lumo-font-size-s);
          color: #8f8b8b;
          text-align: center;
          display: inline-block;
        }
        .width_100{
            margin: 5px !important;
            width: 100%;
        }
        </style>
        <div class="card">
            <div class="paper-header">{{title}}</div>
            <template is="dom-repeat" items="[[options]]">
                <div class="width_100">
                    <div on-click="_assess" data='{{item}}' dataKudo='{{kudo.id}}' style$='background-image: url({{item.icon}});' class='kudo_base'>&nbsp;</div>  
                    <div class="kudo_title">{{item.text}}</div>
                </div>
            </template>
            <paper-button class="button_verify" on-click="sendAnswer">Enviar</paper-button>
            <paper-button class="button_cancel" on-click="reset">Omitir</paper-button>
        </div>
`;
  }

  static get is() { return 'question-detail'; }
  static get properties() {
      return {
          options: {
              type: Array,
              notify: true,
              value: function() { return []; }
          },
          placeholder:{
              type: String,
              notify: true
          },
          title:{
              type: String,
              notify: true
          },
          required:{
              type: Boolean,
              notify: true,
              value:false
          },
      };
  }
  ready(){
      super.ready();
      console.info('me crearon');
  }  
}

window.customElements.define(QuestionDetail.is, QuestionDetail);
