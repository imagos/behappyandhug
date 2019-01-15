import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import './shared-styles-main.js';

class StarShare extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles-main">
        :host {
          display: block;
          font-family: 'Roboto Condensed', sans-serif;
          text-align: center !important;
          min-height: 90vh;
        }

        .header_image {
          background-image: url(../images/background.signup.jpg);
        }
        .p_header {
          vertical-align: text-bottom;
          text-align: center;
          padding-top: 190px;
          
        }
        
        .transbox {
          background-color: rgba(0,0,0,0.5);
          height: 100%;
        }
        
        .avatar.selected{
          border-color: rgba(9, 63, 100,1);
          border-style: solid;
          border-width: 2px;
          background-color: rgba(0, 206, 206,0.5);
        }
        .preselected {
            border-color: #00cece;
            border-style: solid;
            border-width: 1px;
        }
        
        .label {
          margin-top: 15px;
          font-size: 1.3em;
          color: #004284;
        }
        
        :host([hidden]) {
          display: none;
        }
        
        :root {
            --paper-input-container-color: gray;
            --paper-input-container-input-color:gray;
            --paper-input-container-focus-color: blue;
            --paper-input-container-invalid-color: green;
            --paper-input-container-input-color: black;
        }
        </style>
        <div class="container">
            <div class="paper-header header_image">
              <div class="transbox"> 
              <div class="p_header">¿Qué quieres compartir hoy?</div>
              </div>
            </div>
            <div class="width_100">
              <div class="dataEntry">
                  <paper-input id="comment" placeholder="Escribe aquí tu comentario"></paper-input>
              </div>
            </div>

            <div class="card-actions">
                <paper-button class="button_verify" on-tap="_addComment">Enviar</paper-button>
            </div>
        </div>
`;
  }

  static get is() { return 'star-share'; }
  static get properties() {
      return {
        message:        {type: String,    notify: true,   reflectToAttribute: true,},
        nextPage:       {type: String,    notify: true,   reflectToAttribute: true,},
        user:           {type: Object,    notify: true,    },
      };
  }
  
  ready(){
    super.ready();
    console.info('cargando share');
  }
  
  _addComment(){
    var self=this;
    var text="";
    if(this.$.comment==""){
        return;
    }else{
        text=this.$.comment.value;
    }
    db.settings({timestampsInSnapshots: true});
    var user    =self.user;
    db.collection("posts").add({
        uid:        user.uid,
        text:       text,
        team:       user.team,
        area:       user.area,
        nickname:   user.nickname,
        avatar:     user.avatar,
        status:     true,
        registerDate: firebase.firestore.Timestamp.now()
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        self.nextPage="wall";
    })
    .catch(function(error) {
        self.nextPage="error";
        self.message=error;
        console.error("Error adding document: ", error);
    });
  }    
}

window.customElements.define('star-share', StarShare);
