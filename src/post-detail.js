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
import './answers-post.js';

class PostDetail extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles-main">
        :host {
          display: block;
          font-family: 'Roboto Condensed', sans-serif;
          text-align: left !important;
        }
        .paper-header {
          height: 60px;
          font-size: 16px;
          line-height: 50px;
          padding: 0 10px;
          color: white;
          transition: height 0.2s;
          background-color: #27467e !important;
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
            <div id="imgProfile" class$="avatar [[post.avatar]]"></div> [[post.nickname]] 
            <iron-icon icon="communication:location-on"></iron-icon>{{post.location}}[[post.teamId]] 
            <div>
                [[post.text]]
            </div>
            <div class="cards-actions">
              <div style="display:none;">
                <paper-icon-button icon="icons:thumb-up" ></paper-icon-button>[[post.numLike]]
                <paper-icon-button icon="icons:thumb-down"></paper-icon-button>[[post.numDislike]]
              </div>
              
              <iron-icon icon="communication:chat-bubble-outline" id="comment" data=[[post]] on-tap="_openComments"></iron-icon>
            </div>
            <answers-post id='comments' user-uid=[[userUid]] nickname=[[nickname]] avatar=[[avatar]] team-id=[[teamId]] style="display:none"></answers-post>
        </div>
`;
  }

  static get is() { return 'post-detail'; }
  static get properties() {
      return {
            userUid:  { type: String, notify: true},
            nickname: { type: String, notify: true},
            avatar:   { type: String, notify: true},
            teamId:   { type: String, notify: true},
            post:     { type: Object, notify: true},
            
      };
  }
  ready(){
    super.ready();
  }
  sendLike(e){
      console.info('like');
  }
  sendDislike(e){
      console.info('dislike');
  }
  _openComments(e){
    var self=this;
    self.$.comments.loadComments(self.post.id);
    self.$.comments.style.display = "block";
  }
  _closeComments(e){
    this.$.comments.style.display = "none";
  }
}

window.customElements.define(PostDetail.is, PostDetail);
