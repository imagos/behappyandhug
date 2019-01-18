import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';

import './shared-styles-main.js';

class StarConfirm extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles-main">
        :host {
          display: block;
          font-family: 'Roboto Condensed', sans-serif;
          text-align: center !important;
        }
        :host([hidden]) {
          display: none;
        }
        </style>

`;
  }

  static get is() { return 'star-confirm'; }
  static get properties() {
      return {
        message:        {type: String,    notify: true,   reflectToAttribute: true,},
        nextPage:       {type: String,    notify: true,   reflectToAttribute: true,},
      };
  }
  ready(){
    super.ready();
    db.settings({timestampsInSnapshots: true});
    this._createSession();
  }

  _createSession(){
    var self=this;
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    var email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
        email = window.prompt('Please provide your email for confirmation');
    }
  // The client SDK will parse the code from the link for you.
    firebase.auth().signInWithEmailLink(email, window.location.href)
    .then(function(result) {
      // Clear email from storage.
      window.localStorage.removeItem('emailForSignIn');
      console.info(result);
      
      //* 1. Verifica que el correo 
      self._verify(email,result.user.uid);
      // You can access the new user via result.user
      // Additional user info profile not available via:
      // result.additionalUserInfo.profile == null
      // You can check if the user is new or existing:
      // result.additionalUserInfo.isNewUser
    })
    .catch(function(error) {
      self.message=error;
      //self.nextPage="error";
      document.querySelector("star-app").set('route.path', "/error");
      // Some error occurred, you can inspect the code: error.code
      // Common errors could be invalid email and invalid or expired OTPs.
    });
    }
  }
  
  _verify(email,uid){
    console.log("email: " + email + " | uid: " + uid);
    var self=this;
    self.message="La invitación no es correcta comunicate con nuestros amigos Talento y Cultura para que te apoyen.";
    db.collection("guess").where("email","==",email)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            console.info(doc.data());
            var _doc=doc.data();
            if(_doc.status==0){
              self.message="";
              self.guessId= doc.id;
              self._updateTmp(doc.id,uid);
            }
          });
          if(self.message!=""){
            //self.nextPage="error";
            document.querySelector("star-app").set('route.path', "/error");
            console.info(self.message);
          }
      })
      .catch(function(error) {  
          self.message=error;
          //self.nextPage="error";
          document.querySelector("star-app").set('route.path', "/error");
          console.log("Error getting Visit Report: ", error);
      });
  }
  
  _updateTmp(guessId,uid){
    var self=this;
    db.collection("temporal").doc(guessId).set({
        status: 1,
        modifyDate: firebase.firestore.Timestamp.now()
    })
    .then(function() {
      self._getTmp(guessId,uid);
    })
    .catch(function(error) {
      self.message=error;
      //self.nextPage="error";
      document.querySelector("star-app").set('route.path', "/error");
    });
  }
  
  _getTmp(guessId,uid){
    var self=this;
    var docRef = db.collection("temporal").doc(guessId);
    docRef.get().then(function(doc) {
      if (doc.exists) {
        console.info(doc.data().user);
        self._insertUser(doc.data().user,uid,guessId);
      } else {
        self.message="Inconsistencia de información";
        self.nextPage="error";
      }
    });
  }
  
  _insertUser(user,uid,guessId){
    var self=this;
    db.collection("user").doc(uid).set({
        team:     user.team,
        area:     user.area,
        nickname: user.nickname,
        avatar:   user.avatar,
        modifyDate: firebase.firestore.Timestamp.now()
    })
    .then(function() {
      self._updateGuess(guessId);
    })
    .catch(function(error) {
      self.message=error;
      self.nextPage="error";
    });
  }
  
  _updateGuess(guessId){
    var self=this;
    db.collection("guess").doc(guessId).set({
        status: 1,
        modifyDate: firebase.firestore.Timestamp.now()
    })
    .then(function() {
      console.info('FINALIZÓ');
    })
    .catch(function(error) {
      self.message=error;
      self.nextPage="error";
    });
  }
}

window.customElements.define(StarConfirm.is, StarConfirm);
