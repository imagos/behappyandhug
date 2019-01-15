import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';

import './shared-styles-main.js';

class StarSignup extends GestureEventListeners(PolymerElement) {
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
              <div class="p_header">COMPLETA TU PERFIL</div>
              </div>
            </div>
            <div class="width_100">
              <div class="dataEntry label">
                  Coloca un alias (Opcional)
              </div>
              <div class="dataEntry">
                  <paper-input id="nickname" placeholder="nickname"></paper-input>
              </div>
            </div>
            <div class="width_100">
              <div class="dataEntry label">
                  Selecciona tu avatar
              </div>
            </div>
            <div class="width_100">
                <template is="dom-repeat" items="[[avatarOptions]]">
                    <div id="idAvatar_[[item]]" class$="avatar preselected [[item]]" data="[[item]]" on-tap="_checkAvatar"> 
                    </div>
                </template>
            </div>

            <div class="card-actions">
                <paper-button class="button_verify" on-tap="_addInformation">Confirmar</paper-button>
            </div>
        </div>
`;
  }

  static get is() { return 'star-signup'; }
  static get properties() {
      return {
        email:          {type: String,    notify: true,   reflectToAttribute: true,},
        message:        {type: String,    notify: true,   reflectToAttribute: true,},
        nextPage:       {type: String,    notify: true,   reflectToAttribute: true,},
        nickname:       {type: String,    notify: true,   reflectToAttribute: true  },
        avatar:         {type: String,    notify: true,   reflectToAttribute: true  },
        user:           {type: Object,    notify: true,   reflectToAttribute: true  },
        selectedAvatar: {type: String,    notify: true,   },
        team:           {type: String,    notify: true,   },
        area:           {type: String,    notify: true,   },
        avatarOptions:  {type: Array,     notify: true,   value: ['a1','a2','a3','a4','a5','a6']},
      };
  }
  
  ready(){
    super.ready();
    const firestore = firebase.firestore();
    const settings = {timestampsInSnapshots: true};
    firestore.settings(settings);
    this._verify();
  }
  _verify(){
    var self=this;
    self.message="La invitación no es correcta comunicate con nuestros amigos Talento y Cultura para que te apoyen.";
    db.collection("guess").where("email","==",self.email)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            console.info(doc.data());
            var _doc=doc.data();
            if(_doc.status==0){
              self.message="";
              self.team   =_doc.team;
              self.area   =_doc.area;
            }
          });
          if(self.message!=""){
            self.nextPage="error";
            console.info(self.message);
          }
      })
      .catch(function(error) {
          self.message=error;
          self.nextPage="error";
          console.log("Error getting Visit Report: ", error);
      });
  }
  
  _addInformation(){
    var self=this;
    if(this.selectedAvatar==""){return;}  
    if(this.$.nickname.value!=""){
      this.user.nickname=this.$.nickname.value;
    }else{
      this.user.nickname="agilenauta";
    }
    this.user.avatar    =this.selectedAvatar;
    this.user.team      =this.team;
    this.user.area      =this.area;
    self._saveUser();
  }    
  
  _saveUser(){
    db.settings({timestampsInSnapshots: true});
    var self=this;
    console.info(self.user);
    db.collection("users").doc(self.user.uid).set({
        avatar:         self.user.avatar,
        team:           self.user.team,
        area:           self.user.area,
        nickname:       self.user.nickname,
        registerDate: firebase.firestore.Timestamp.now()
    })
    .then(function() {
      self.nickname=self.user.nickname;
      self.avatar=self.user.avatar;
      console.info(self.user);
      self.nextPage='master';
      self._updateFB();
    })
    .catch(function(error) {
      self.message=error;
      self.nextPage="error";
    });
  }
  
  _updateFB(){
    var self=this;
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName:  self.nickname,
      photoURL:     self.avatar
    }).then(function() {
      console.log('conforme FB');
    }).catch(function(error) {
      console.log('Error: ' + error);
    });
  }
  
  _checkAvatar(e){
    console.info(e);
    var text, idEle;
    var path = e.path || (e.composedPath && e.composedPath()); 
    text=path[0].data;
    idEle=path[0].id; 
    // if(path){
    //   text=e.path[0].data;
    //   idEle=e.path[0].id;      
    // }else{
    //   text  =e.explicitOriginalTarget.data;
    //   idEle =e.explicitOriginalTarget.id;
    // }

    var element=this.shadowRoot.querySelector('#'+idEle);
    for (var i = 0; i < element.parentNode.childNodes.length; i++) {
        //classList.remove('selected')
        if(element.parentNode.childNodes[i].nodeName=="DIV"){
            element.parentNode.childNodes[i].classList.remove('selected');
        }
    }
    element.classList.add('selected');
    this.selectedAvatar = text;
  }
}

window.customElements.define(StarSignup.is, StarSignup);
