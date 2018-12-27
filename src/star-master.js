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
import './post-detail.js';

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
      
      <div id="postWall">
      </div>
      
      <div id="main" class="container">
      </div>
      
    `;
  }
  static get properties() {
    return {
      userUid:  { type: String, notify: true },
      avatar:   { type: String, notify: true },
      nickname: { type: String, notify: true },
      teamId:   { type: String, notify: true },
      numQuestions: { type: Number, notify: true, value: 0, observer: '_checkNumber' },
      activeComments:{
        type: Boolean,
        notify: true,
        value: false,
        reflectToAttribute: true
      },

    };
  }
  ready(){
    super.ready();
    db.settings({timestampsInSnapshots: true});
    this._loadlistReport();
  }
  _checkNumber(newValue, oldValue){
    console.log(newValue);
    if(newValue>0){
      console.log('borrando');
      this.$.postWall.innerHTML="";
    }
  }
  _loadQuestions(){
    var self=this;
    var zindex=10;
    self.numQuestions=0;
    db.collection("questions").where("active","==",true)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            self._verifyAnswer(doc.id, doc.data(),zindex);
            zindex--;
          });
      });
      // .catch(function(error) {
      //     console.log("Error getting poll: ", error);
      // });

  }
  _verifyAnswer(_questionId,_questionData,_zindex){
    var self=this;
    var rowId=_questionId + self.userUid;
    var docRef;
    if(_questionData.toShare){
      docRef = db.collection("posts").doc(rowId);
    }else{
      docRef = db.collection("answers").doc(rowId);  
    }
    
    docRef.get().then(function(doc) {
      if (doc.exists) {
        return false;
      } 
      else {
        var options=[];
        if(_questionData.withOptions){
          var value;
          var map=_questionData.options;
          Object.keys(map).forEach(function(key) {
              value = map[key];
              options.push(value);
          });
        }
        var elem=document.createElement('question-detail');
        elem.questionId     =_questionId;
        elem.title          =_questionData.question;
        elem.withOptions    =_questionData.withOptions;
        elem.withOpenAnswer =_questionData.withOpenAnswer;
        elem.background     =_questionData.background;
        elem.toShare        =_questionData.toShare;
        
        elem.options        =options;
        elem.userUid        =self.userUid;
        elem.avatar         =self.avatar;
        elem.nickname       =self.nickname;
        elem.teamId         =self.teamId;
        elem.zindex         =_zindex;
        elem.visible=true;  
        
        self.$.main.appendChild(elem);
        
        self.numQuestions++;
        return true;
      }
    });
  }
  
  _createPost(data){
    var elem=document.createElement('post-detail');
    var _row=data;
    elem.post=_row;
    elem.nickname = this.nickname;
    elem.avatar   = this.avatar;
    elem.userUid  = this.userUid;
    elem.teamId   = this.teamId;
    this.$.postWall.appendChild(elem);
  }

  _loadlistReport(){
    var self=this;
    this.$.postWall.innerHTML="";
    db.collection("posts").orderBy("registerDate","desc")
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            var _doc=doc.data();
            _doc.id=doc.id;
            self._createPost(_doc);
          });
      })
      .catch(function(error) {
          console.log("Error getting Visit Report: ", error);
      });
    
  }
}

window.customElements.define('star-master', StarMaster);
