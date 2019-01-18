import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/iron-icons/image-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-icons/communication-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-input/paper-input-container.js';
import '@polymer/paper-button/paper-button.js';
import './shared-styles-main.js';
import './comment-detail.js';

class AnswersPost extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles-main">
        :host {
          display: block;
          font-family: 'Roboto Condensed', sans-serif;
          text-align: left !important;
        }
        </style>
        <div style="height: 55vh;" hidden=[[cancel]]>
          <div style="overflow-y:auto;height:40vh;" id="chat">

          </div>
          <div style="width:100%;margin:0px;padding:0px;">
            <div style="display:inline-block;width:75%;">
              <paper-textarea id="txtMessage" label="[[nickname]], ingresa tu comentario..."></paper-textarea>
            </div>
            <div style="display:inline-block;width:20%;">
              <paper-icon-button icon="icons:send"    id="btnSendMessage" on-tap="sendMessage"  autofocus></paper-icon-button>
              <paper-icon-button icon="icons:cancel"  id="btnClose"       on-tap="closeSection" >         </paper-icon-button>
            </div>
          </div>
        </div>
`;
  }

  static get is() { return 'answers-post'; }
  static get properties() {
      return {
        postId:     { type: String,     notify: true },
        nickname:   { type: String,     notify: true },
        avatar:     { type: String,     notify: true },
        userUid:    { type: String,     notify: true },
        cancel:     { type: Boolean,    notify: true, value: true },
      };
  }
  ready(){
    super.ready();
    db.settings({timestampsInSnapshots: true});
  }
  loadComments(postId){
    var self=this;
    self.postId=postId;
    self.$.chat.innerHTML="";
    
    db.collection("postComments").where("postId","==",postId).orderBy("registerDate","desc")
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            var elem=document.createElement('comment-detail');
            var comment={};
            comment.avatar=doc.data().avatar;
            comment.nickname=doc.data().nickname;
            comment.message=doc.data().message;
            elem.comment=comment;
            self.$.chat.appendChild(elem);
            console.log(doc.data());
          });
          //self.$.btnSendMessage.style.display = "block";
          self.cancel=false;
      })
      .catch(function(error) {
          console.log("Error getting Visit Report: ", error);
      });
  }
  
  closeSection(){
    this.cancel=true;
  }
   
  sendMessage(e){
    var self=this;
      if(self.$.txtMessage.value.length!=0){
        db.collection("postComments").add({
            postId:     self.postId,
            message:    self.$.txtMessage.value,
            nickname:   self.nickname,
            userUid:    self.userUid,
            team:       self.team,
            avatar:     self.avatar,
            registerDate: firebase.firestore.Timestamp.now()
        })
        .then(function() {
            self.$.txtMessage.value="";
            //self.$.btnSendMessage.style.display = "none";
            self.cancel=true;
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
         self.loadComments(self.postId);
      }
  }
}

window.customElements.define(AnswersPost.is, AnswersPost);
