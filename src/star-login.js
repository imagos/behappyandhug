import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';

import './shared-styles-main.js';

class StarLogin extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles-main">
        :host {
          display: block;
          font-family: 'Roboto Condensed', sans-serif;
          text-align: center !important;
          min-height: 90vh;
          background-repeat: no-repeat;
          background-position: center;
          background-image: url(../images/background.help.jpg);
          color: white;
        }
        
        :host([hidden]) {
          display: none;
        }

        :root {
            --paper-input-container-color: white;
            --paper-input-container-input-color:white;
            --paper-input-container-focus-color: blue;
            --paper-input-container-invalid-color: red;
            --paper-input-container-input-color: white;
        }
        </style>
        <div class="container container_top">
            <div class="width_100 title-size">
                <span>INICIA TU MISIÓN >> </span>
            </div>
            <div class="width_100 isotipo">
            </div>
            <div class="width_100">
              <div class="dataEntry">
                  Ingresa tu correo corporativo
              </div>
              <div class="dataEntry">
                  <paper-input id="email" placeholder="email" type="email" auto-validate=true errorMessage="Ingrese un correo válido"></paper-input>
              </div>
            </div>
            <div class="card-actions">
                <paper-button class="button_verify" on-tap="_checkEmail">CONFIRMAR</paper-button>
            </div>
        </div>
`;
  }

  static get is() { return 'star-login'; }
  static get properties() {
      return {
        guessId:        {type: String,    notify: true},
        email:          {type: String,    notify: true},
        message:        {type: String,    notify: true,   reflectToAttribute: true,},
        nextPage:       {type: String,    notify: true,   reflectToAttribute: true,},
        isActiveForm:   {type: Boolean,   notify: true,   value: false,  },
        nickname:       {type: String,    notify: true,   reflectToAttribute: true  },
        selectedAvatar: {type: String,    notify: true,   reflectToAttribute: true  },
        team:           {type: String,    notify: true,   },
        area:           {type: String,    notify: true,   },
        avatarOptions:  {type: Array,     notify: true,   value: ['a1','a2','a3','a4','a5','a6']},
      };
  }
  
  ready(){
    super.ready();
    db.settings({timestampsInSnapshots: true});
  }
  _checkEmail(){
    console.info(this.$.email.value);
    if(this.$.email.value == null || this.$.email.value == "") {
      return;
    }else{
      var str=this.$.email.value;
      this.email=str.toLowerCase();  
      this._verify();
    }
  }
  
  _verify(){
    var self=this;
    self.message="Por favor, comunícate con el equipo de T&C para obtener indicaciones.";
    db.collection("guess").where("email","==",self.email)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            console.info(doc.data());
            var _doc=doc.data();
            if(_doc.status==0){
              self.message="";
              self._sendEmail();
            }
          });
          if(self.message!=""){
            //self.nextPage="error";
            document.querySelector("star-app").set('route.path', "/error");
          }
      })
      .catch(function(error) {
          self.message=error;
          //self.nextPage="error";
          document.querySelector("star-app").set('route.path', "/error");
      });
  }
  
  _sendEmail(){
    var self=this;
    //https://behappyandhug.firebaseapp.com/
    //http://behappy-elvisnizama.c9users.io:8081
    var actionCodeSettings = {
      url: 'http://behappy-elvisnizama.c9users.io:8081',
      handleCodeInApp: true,
    };
    firebase.auth().sendSignInLinkToEmail(self.email, actionCodeSettings)
      .then(function() {
        window.localStorage.setItem('emailForSignIn', self.email);
        //self.nextPage ="validate";      
        document.querySelector("star-app").set('route.path', "/validate");
      })
      .catch(function(error) {
        self.message=error;
        //self.nextPage="error";
        document.querySelector("star-app").set('route.path', "/error");
      });
  }
}

window.customElements.define(StarLogin.is, StarLogin);
