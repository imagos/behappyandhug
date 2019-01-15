import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './my-icons.js';
import './star-master.js';
import './login-free.js';
import './shared-styles-main.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class BeHappy extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles-main">
        :host {
          --app-primary-color: #043263;
          --app-secondary-color: black;
          font-family: 'Roboto Condensed', sans-serif;
          display: block;
        }
        app-toolbar {
            color: #fff;
            background-color: #0051a3;
        }
        app-toolbar paper-icon-button {
            --paper-icon-button-ink-color: white;
        }
        paper-button.login { 
          background-color: #4285f4;
          color: white;
          width: 34px;
          height: 34px;
        }
      </style>
      <div hidden$="{{loggedIn}}" width="100%" style="text-align:center;">
        <login-free id='login' name-app=[[nameApp]] send-login={{sendLogin}}></login-free>
      </div>
      <div hidden$="{{!loggedIn}}" width="100%" style="text-align:center;">
        <app-toolbar class="toolbar_main">
          <paper-icon-button icon="arrow-back" id="mBack" on-tap="closeChat" style="display:none"></paper-icon-button>
          <paper-icon-button icon="icons:home" on-tap="_setMaster"></paper-icon-button>
          <div main-title>Star [[nameApp]]</div>
          <div style="display:table">
            <div id="imgProfile" class$="avatar {{avatar}}"></div>
          </div>
        </app-toolbar>
        
        <star-master id='master' active-comments={{activeComments}}></star-master>
        <div style="font-size: 8px;color:gray;">Developed by @imago.group for BBVA Continental</div>
      </div>
    `;
  }

  static get properties() {
    return {
      uid: {
        type: Object,
        notify: true
      },
      routeData: Object,
      subroute: Object,
      nickname:{
        type:String,
        notify: true,
        value: 'Andrés'
      },
      teamId:{
        type: String,
        notify: true,
        value: 'Benefits&Services'
      },
      nameApp:{
        type: String,
        notify: true,
        value: 'Agile'
      },
      avatar:{
        type: String,
        notify: true,
        value: 'a1'
      },
      loggedIn:{
        type: Boolean,
        notify: true,
        value: false
      },
      activeComments:{
        type: Boolean,
        notify: true,
        value: false
      },
      sendLogin:{
        type: Boolean,
        notify: true,
        value: false,
        observer: '_saveLogin'
      },
    };
  }

  ready(){
    super.ready();
    db.settings({timestampsInSnapshots: true});
    this._login();
  }
  _saveLogin(newValue, oldValue){
    if(newValue){
      this._addUser(this.$.login.nickname, this.$.login.selectedAvatar, this.$.login.teamId);
    }
  }
  _login(){
    var parent = this;
    firebase.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    });
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        parent.uid = user.uid;
        parent.$.login.userUid=user.uid;
        parent.$.master.userUid=user.uid;
        parent._verify(user.uid);
      } else {
        console.info('bye bye');
      }
    });
  }
  _setMaster(){
    var parent = this;
    parent.$.master.teamId=parent.teamId;
    parent.$.master.nickname=parent.nickname;
    parent.$.master.avatar=parent.avatar;                
    parent.$.master._loadQuestions();
  }
  _verify(){
    var parent = this;
    var docRef = db.collection("users").doc(parent.uid);
    docRef.get().then(function(doc) {
      if (doc.exists) {
        //console.log("Document data:", doc.data());
        parent.teamId=doc.data().teamId;
        parent.nickname=doc.data().nickname;
        parent.avatar=doc.data().avatar;
        parent.area=doc.data().area;
        parent.loggedIn=true;
        parent._setMaster();
      } else {
        parent.loggedIn=false;
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }
  /*
  *        area: _area,
  */
  _addUser(_nickname,_avatar,_teamId){
    var parent = this;
    db.collection("users").doc(parent.uid).set({
      nickname: _nickname,
      avatar: _avatar,
      teamId: _teamId,
      registerDate: firebase.firestore.Timestamp.now()
    })
    .then(function() {
        //console.log("Document successfully written!");
        parent.loggedIn=true;
        parent._setMaster();
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
  }
}

window.customElements.define('be-happy', BeHappy);
