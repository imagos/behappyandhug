import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './my-icons.js';
import './shared-styles-main.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class StarApp extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles-main">
        :host {
          --app-primary-color: #0051a3;
          --app-secondary-color: black;
          font-family: 'Roboto Condensed', sans-serif;
          display: block;
        }
        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }
        app-header {
          color: #fff;
          background-color: var(--app-primary-color);
        }
        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }
        .drawer-list {
          margin: 0 20px;
        }
        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: var(--app-secondary-color);
          line-height: 40px;
        }
        .drawer-list a.iron-selected {
          color: black;
          font-weight: bold;
        }
        .center {
          text-align: center;
        }
      </style>
      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>
      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>
      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>Menu</app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <a name=""   href="[[rootPath]]">   Inicio</a>
            <a name="about"   href="[[rootPath]]about">   About</a>
          </iron-selector>
        </app-drawer>
        <!-- Main content -->
        <app-header-layout has-scrolling-region="">
          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="arrow-back" id="mBack" on-tap="closeChat" style="display:none"></paper-icon-button>
              <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title class="center">STAR [[nameApp]]</div>
              <div style="display:table">
                <div style="display:inline-block;"id="imgProfile" class$="avatar [[avatar]]"></div>
              </div>
            </app-toolbar>
          </app-header>
          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <star-login     next-page={{page}}  message={{message}}   name="login">     </star-login>
            <star-validate  next-page={{page}}                        name="validate">  </star-validate>
            <star-success   next-page={{page}}  message={{message}}   name="success">   </star-success>
            <star-signup    next-page={{page}}  message={{message}}   name="signup"     user={{user}}   email=[[email]]   nickname={{nickname}} avatar={{avatar}} area={{area}} team={{team}}>    </star-signup>
            <star-confirm   next-page={{page}}  message={{message}}   name="confirm">   </star-confirm>
            <star-questions next-page={{page}}  message={{message}}   name="questions"     user=[[user]]   nickname=[[nickname]] avatar=[[avatar]] area=[[area]] team=[[team]]>    </star-questions>
            <star-share     next-page={{page}}  message={{message}}   name="share"      user=[[user]]   nickname=[[nickname]] avatar=[[avatar]] area=[[area]] team=[[team]]>    </star-share>
            <star-wall      next-page={{page}}  message={{message}}   name="wall"       user=[[user]]   nickname=[[nickname]] avatar=[[avatar]] area=[[area]] team=[[team]]>    </star-wall>
            <star-error     next-page={{page}}  message={{message}}   name="error">     </star-error>
            <star-about     next-page={{page}}                        name="about"      name-app=[[nameApp]]>   </star-about>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  static get properties() {
    return {
      page:         {type: String,  notify: true, reflectToAttribute: true, observer: '_pageChanged'  },
      routeData:    Object,
      subroute:     Object,
      nameApp:      {type: String,  notify: true, value: 'AGILE'  },
      message:      {type: String,  notify: true, reflectToAttribute: true, },
      user:         {type: Object,  notify: true, reflectToAttribute: true, },
      avatar:       {type: String,  notify: true, value: 'a99'    },
      nickname:     {type: String,  notify: true, value: 'agilenauta'},
      team:         {type: String,  notify: true, },
      area:         {type: String,  notify: true, },
      activeComments: {type: Boolean, notify: true, value: false  },
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }
  
  ready(){
    super.ready();
    this._verifyUser();
  }

  _routePageChanged(page) {
    if(this.route.__queryParams.mode=='signIn'){
      this._createSession();
      return;
    }
    if (!page) {
      this._verifyUser();
    } else if (['login', 'signup',  'validate','confirm', 'questions','about','error','success','share','wall'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = 'about';
    }

    // Close a non-persistent drawer when the page & route are changed.
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _pageChanged(page) {
    console.info("_pageChanged: " + page);
    switch (page) {
      case 'login':
        import('./star-login.js');
        break;
      case 'validate':
        import('./star-validate.js');
        break;
      case 'confirm':
        import('./star-confirm.js');
        break;
      case 'signup':
        import('./star-signup.js');
        break;
      case 'questions':
        import('./star-questions.js');
        break;
      case 'share':
        import('./star-share.js');
        break;
      case 'success':
        import('./star-success.js');
        break;
      case 'wall':
        import('./star-wall.js');
        break;
      case 'error':
        import('./star-error.js');
        break;
      case 'about':
        import('./star-about.js');
        break;
    }
  }
  
  _verifyUser(){
    var self=this;
    self.user={};
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        self.user.uid=user.uid;
        self.email=user.email;
        self._getUser();
      } else {
        self.user={};
        self.page='login';
      }
    });
  }
  _reLogin(){
    var self=this;
    firebase.auth().currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
      .then(function(usercred) {
        self.user.uid=usercred.uid;
        self.email=usercred.email;
        self._getUser();
      })
      .catch(function(error) {
        self.user={};
        self.page='login';
      });
  }  
  _getUser(){
    var self=this;
    const firestore = firebase.firestore();
    const settings = {timestampsInSnapshots: true};
    firestore.settings(settings);
    var docRef = db.collection("users").doc(self.user.uid);
    docRef.get().then(function(doc) {
        if (doc.exists) {
          self.user.team    =doc.data().team;
          self.user.area    =doc.data().area;
          self.user.avatar  =doc.data().avatar;
          if(doc.data().nickname){
            self.user.nickname=doc.data().nickname;  
          }else{
            self.user.nickname="agilenauta";
          }
          self.nickname = self.user.nickname;
          self.avatar   = self.user.avatar;
          self.area     = self.user.area;
          self.team     = self.user.team;
          self.page='questions';
        } else {
          self.page='signup';
        }
    }).catch(function(error) {
        self.page='error';
        self.message=error;
    });
  }
  
  _createSession(){
    var self=this;
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Por favor ingrese su correo');
      }
      firebase.auth().signInWithEmailLink(email, window.location.href)
        .then(function(result) {
          window.localStorage.removeItem('emailForSignIn');
          self.user={};
          self.user.uid=result.user.uid;
          self.email=email;
          self.page='success';
        })
        .catch(function(error) {
          self.page='error';
          self.message=error;
        });
    }
  }
}

window.customElements.define('star-app', StarApp);
