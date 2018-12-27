import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';

class CommentDetail extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles-main">
        .div-author-comment{
          padding:5px;
          background:#fff;
          border-radius: 18px;
          margin-top:5px;
          text-align: left;
        }
        .text-author-comment{
          color:#365899;
        }
        </style>
        <div class="div-author-comment"><div  class$="avatar [[comment.avatar]]"></div>
            <b class="text-author-comment">[[comment.nickname]]</b>: [[comment.message]]
        </div>
`;
  }

  static get is() { return 'comment-detail'; }
  static get properties() {
      return {
            comment:     { type: Object, notify: true},
      };
  }
  ready(){
    super.ready();
  }
}

window.customElements.define(CommentDetail.is, CommentDetail);
