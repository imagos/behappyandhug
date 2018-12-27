import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/iron-icons/image-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-icons/communication-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import './shared-styles-main.js';

class LoginFree extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles-main">
        :host {
          display: block;
          font-family: 'Roboto Condensed', sans-serif;
          text-align: left !important;
        }
        .avatar.selected{
            border-color: blue;
            border-style: solid;
            border-width: 3px;
        }
        .preselected {
            border-color: white;
            border-style: solid;
            border-width: 3px;
        }
            
        .card {
            margin: 8px;
            padding: 8px;
            color: #757575;
            border-radius: 5px;
            background-color: #fff;
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
        .width_100{
            margin: 0px !important;
            width: 100%;
        }
        .card-actions{
          text-align: center;
        }
        </style>
        <div class="card">
            <div>Welcome to Star [[nameApp]]</div>
            <div class="width_100">
                Completar tus datos para ser parte de la aventura
            </div>
            <div class="width_100">
                <vaadin-combo-box id="cmbTeams" placeholder="Equipo" value={{teamId}} class="width_100"></vaadin-combo-box>
            </div>
            <div class="width_100">
                <paper-input id="nickname" placeholder="nickname"></paper-input>
            </div>
            <div class="width_100">
                <div class="width_100">
                    Selecciona tu avatar
                </div>
                <div class="width_100">
                <template is="dom-repeat" items="[[avatarOptions]]">
                    <div id="idAvatar_[[item]]" class$="avatar preselected [[item]]" data="[[item]]" on-click="_checkAvatar"> 
                    </div>
                </template>
                </div>
            </div>

            <div class="cards-actions">
                <paper-icon-button icon="icons:send" on-tap="_createSession"></paper-icon-button>
            </div>
        </div>
`;
  }

  static get is() { return 'login-free'; }
  static get properties() {
      return {
            userUid: {
                type: String,
                notify: true
            },
            nameApp:{
                type: String,
                notify: true,
            },
            avatarOptions:{
                type: Array,
                notify: true,
                value: ['a1','a2','a3']
            },
            teams:{
                type: Array,
                notify: true,
                value: []
            },
            nickname: {
                type: String,
                notify: true,
                reflectToAttribute: true
            },
            selectedAvatar: {
                type: String,
                notify: true,
                reflectToAttribute: true
            },
            teamId: {
                type: String,
                notify: true,
                reflectToAttribute: true
            },
            sendLogin: {
                type: Boolean,
                notify: true,
                reflectToAttribute: true
            },
      };
  }
  ready(){
      super.ready();
      db.settings({timestampsInSnapshots: true});
      this._loadTeams();
  }
  _createSession(){
      this.nickname=this.$.nickname.value;
      window.localStorage.setItem('emailForSignIn', this.nickname);
      this.sendLogin=true;
  }
  
  _loadTeams() {
    var self=this;
    this.teams=[];
    db.collection("teams").where("status", "==", true)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var item={};
              //item.value    = doc.id;
              item.value    = doc.data().name;
              item.label    = doc.data().name;
              self.teams.push(item);
          });
          self.$.cmbTeams.items=self.teams;
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  }
  _checkAvatar(e){
    var text=e.path[0].data;
    var idEle=e.path[0].id;
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

window.customElements.define(LoginFree.is, LoginFree);
