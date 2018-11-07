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

class MyView1 extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          padding: 0px;
        }
      </style>
      <div id="main">
        
      </div>
    `;
  }
  static get properties() {
    return {
      userUid: {
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
    };
  }
  ready(){
    super.ready();
    this._loadPoll(); 
  }
  
  _loadPoll(){
    var self=this;
    db.settings({timestampsInSnapshots: true});
    this.arrPolls=[];
    db.collection("poll").where("active","==",true)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var item={};
              item.id     = doc.id;
              item.name   = doc.data().name;
              console.info(item);
              self._loadQuestions(item.id,doc.data().name);
              self.arrPolls.push(item);
          });
          
      })
      .catch(function(error) {
          console.log("Error getting poll: ", error);
      });
  }
  
  _loadQuestions(idPoll,namePoll){
    var self=this;
    var refPoll='/poll/'+idPoll; //where("poll","==",refPoll)
    console.info('questions ==> ' + refPoll);
    db.settings({timestampsInSnapshots: true});
    this.arrQuestions=[];
    db.collection("questions").where("active","==",true)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var item={};
              var options=[];
              //console.info(doc.data());
              
              item.pollId=  idPoll;
              item.questionId=doc.id;
              item.namePoll=namePoll;
              item.question = doc.data().question;
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
              elem.options=item.options;
              
              self.$.main.appendChild(elem);
              
              self.arrQuestions.push(item);
              console.info(item);
          });
          
      });
      // .catch(function(error) {
      //     console.log("Error getting poll: ", error);
      // });
  }


              // if(item.withOptions){
              //   item.arrAnswer=[];
              //   var _arrAnswer=doc.data().answers;
              //   for (var index = 0, len = _arrAnswer.length; index < len; ++index) {
              //       console.log(_arrAnswer[index]);
              //       self._loadAnswer(_arrAnswer[index],doc.id);    
              //   }
              // }  
  // _loadAnswer(_answerId,_questionId){
  //   var self=this;
  //   db.settings({timestampsInSnapshots: true});
  //   db.collection("answers").doc(_answerId)
  //   .onSnapshot(function(doc) {
  //       var objIndex = self.arrQuestions.findIndex((obj => obj.questionId == _questionId));
  //       console.log("Current data: ", doc.data());
  //       self.arrQuestions[objIndex].arrAnswer.push(doc.data());
  //       console.info(self.arrQuestions[objIndex]);
  //   });
  //     // .catch(function(error) {
  //     //     console.log("Error getting poll: ", error);
  //     // });
  // }

}

window.customElements.define('my-view1', MyView1);
