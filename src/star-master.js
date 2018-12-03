/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import './question-detail.js';

class StarMaster extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          padding: 0px;
          font-family: 'Roboto Condensed', sans-serif;
        }
        .container{
          position: relative;
        }
      </style>
      <div id="main" class="container">
      </div>

    `;
  }
  static get properties() {
    return {
      userUid: {
        type: String,
        notify: true
      },
      userPicture: {
        type: String,
        notify: true
      },
      nickname: {
        type: String,
        notify: true,
      },
      groupId: {
        type: String,
        notify: true
      },
      arrPolls: {
        type:   Array,
        notify: true,
        reflectToAttribute: true,
      },
      arrQuestions: {
        type:   Array,
        notify: true,
        reflectToAttribute: true,
      },
      numQuestions: {
        type: Number,
        notify: true,
        value: 0
      }
    };
  }
  ready(){
    super.ready();
    this._loadQuestions(); 
  }
  

  _loadQuestions(){
    var self=this;
    var zindex=10;
    db.settings({timestampsInSnapshots: true});
    this.arrQuestions=[];
    db.collection("questions").where("active","==",true)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var item={};
              var options=[];
              item.questionId=doc.id;
              item.question = doc.data().question;
              item.background = doc.data().background;
              item.withOptions = doc.data().withOptions;
              item.withOpenAnswer = doc.data().withOpenAnswer;
              if(item.withOptions){
                var value;
                var map=doc.data().options;
                Object.keys(map).forEach(function(key) {
                    value = map[key];
                    options.push(value);
                });
              }
              item.options=options;
              var elem=document.createElement('question-detail');
              elem.questionId=doc.id;
              elem.title=doc.data().question;
              elem.withOptions=doc.data().withOptions;
              elem.withOpenAnswer=doc.data().withOpenAnswer;
              elem.background=doc.data().background;
              elem.toShare=doc.data().toShare;
              
              elem.options=item.options;
              elem.userUid=self.userUid;
              elem.userPicture=self.userPicture;
              elem.nickname=self.nickname;
              //elem.groupId=self.groupId;
              elem.zindex=zindex;
              elem.visible=true;  
              
              self.$.main.appendChild(elem);
              self.arrQuestions.push(item);
              zindex--;
              self.numQuestions++;
          });
          
      });
      // .catch(function(error) {
      //     console.log("Error getting poll: ", error);
      // });
  }
}

window.customElements.define('star-master', StarMaster);
