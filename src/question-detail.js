import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-input/paper-input-container.js';
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
        .button_verify{
          background-color: blue;
          color: white;
        }
        .button_cancel{
          background-color: gray;
          color: white;
        }
        .card-actions{
          text-align: center;
        }
        </style>
        <div class="card">
            <div class="paper-header">{{title}}</div>
            <template is="dom-repeat" items="[[options]]">
                <div class="width_100">
                    <div data='{{item}}' data-question='{{questionId}}' style$='background-image: url({{item.icon}});' class='kudo_base' on-tap='checkOption'>&nbsp;</div>  
                    <div class="kudo_title">{{item.text}}</div>
                </div>
            </template>
            <template is="dom-if" if="{{withOpenAnswer}}">
                <paper-textarea id="opinion" label="Por favor ingresa tu comentario" char-counter></paper-textarea>
            </template>
            <div class="cards-actions">
                <paper-button class="button_verify" on-click="sendAnswer" data='{{questionId}}'>Enviar</paper-button>
                <paper-button class="button_cancel" on-click="reset">Omitir</paper-button>
            </div>

        </div>
`;
  }

  static get is() { return 'question-detail'; }
  static get properties() {
      return {
          userUid: {
            type: String,
            notify: true
          },
          questionId: {
              type: String,
              notify: true              
          },
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
          withOptions:{
              type: Boolean,
              notify: true,
              value:false
          },
          withOpenAnswer:{
              type: Boolean,
              notify: true,
              value:false
          },
          optionSelected: {
              type: String,
              notify: true,
              value: "Prueba"
          }
      };
  }
  ready(){
      super.ready();
  }
  checkOption(e){
    //var kudoSeleccionado = Polymer.dom(e).localTarget;
    console.info(e);
    // var _card = kudoSeleccionado.data;
    // var idKudo = kudoSeleccionado.datakudo;
    // var idCard  = _card.id;
    // for (var _idCard in this.cards) {
    //     if(this.cards[_idCard].idCard != idCard){
    //       var _idBtnKudo=this.$$('#id_img_' +this.cards[_idCard].idCard +'_' +idKudo);
    //       _idBtnKudo.classList.remove('kudo_enable');
    //     }
    // }
  }
  sendAnswer(e){
    db.settings({timestampsInSnapshots: true});
    var answer={};
    var self=this;
    answer.questionId=self.questionId;
    if(self.withOpenAnswer){
        //answer.text=self.$.opinion.text;
    }
    answer.userUid=self.userUid;
    answer.optionSelected=self.optionSelected;
    
    db.collection("answers").add(answer)
    .then(function() {
      self.message="Opinión registrada con éxito!";
    });
    console.info(self.$.opinion);
  }
}

window.customElements.define(QuestionDetail.is, QuestionDetail);
