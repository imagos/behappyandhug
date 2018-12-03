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
import './my-icons.js';
import './star-master.js';
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

      <div hidden$="{{!loggedIn}}" width="100%" style="text-align:center;">
        <app-toolbar style="background-color:#072146;">
          <paper-icon-button icon="menu" ></paper-icon-button>
          <paper-listbox slot="dropdown-content">
            <paper-item>alpha</paper-item>
          </paper-listbox>
          <div main-title>Star [[nameApp]]</div>
          <div style="display:table">
            <img id="imgProfile" class$="avatar [[userPicture]]">
          </div>
        </app-toolbar>
        
        <star-master id='master'></star-master>
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
      groupId:{
        type: String,
        notify: true,
        value: 'Benefits&Services'
      },
      nameApp:{
        type: String,
        notify: true,
        value: 'Agile'
      },
      userPicture:{
        type: String,
        notify: true,
        value: 'a1'
      },
      loggedIn:{
        type: Boolean,
        notify: true,
        value: true
      },
    };
  }

  ready(){
    super.ready();
    this._login();
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
        parent.$.master.userUid=user.uid;
        parent.$.master.groupId=parent.groupId;
        parent.$.master.nickname=parent.nickname;
        parent.$.master.userPicture=parent.userPicture;
      } else {
        console.info('bye bye');
      }
      // ...
    });
  }
}

window.customElements.define('be-happy', BeHappy);
