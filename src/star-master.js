import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles-main.js';
import './question-detail.js';

class StarMaster extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles-main">
        :host {
          display: block;
          padding: 0px;
          font-family: 'Roboto Condensed', sans-serif;
        }
        .container_rel {
          position: relative;
        }
      </style>
      <div id="main" class="container">
      </div>
    `;
  }
  static get properties() {
    return {
      user:       { type: Object, notify: true },
      avatar:     { type: String, notify: true },
      nickname:   { type: String, notify: true },
      team:       { type: String, notify: true },
      area:       { type: String, notify: true },
      nextPage:   { type: String, notify: true, reflectToAttribute: true,},
      message:    { type: String, notify: true, reflectToAttribute: true,},
      numQuestions:   { type: Number, notify: true },
    };
  }
  ready(){
    super.ready();
    db.settings({timestampsInSnapshots: true});
    console.log(this.user);
    console.log('AREA: ' + this.area);
    var user = firebase.auth().currentUser;
    if (user != null) {
      this._loadQuestions();
    } else {
      document.querySelector("star-app").set('route.path', "/login");
    }
    
  }

  _loadQuestions(){
    var self=this;
    var zindex=10;
    self.numQuestions=0;
    console.info("self.area ==> " + self.area);
    db.collection("questions").where("active","==",true).where("area","==",self.area)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            console.info(doc.id);
            self._verifyAnswer(doc.id, doc.data(),zindex);
            zindex--;
          });
      })
      .catch(function(error) {
        //self.nextPage = 'error';
        self.message  = error;
        document.querySelector("star-app").set('route.path', "/error");
      });

  }
  _verifyAnswer(_questionId,_questionData,_zindex){
    var self=this;
    var existsAnswer=false;
    
    db.collection("answers").where("questionId","==",_questionId).where("uid","==",self.user.uid)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            existsAnswer=true;
          });
          if(existsAnswer){
            //self.nextPage='wall';
            document.querySelector("star-app").set('route.path', "/wall");
          }else{
            self._createQuestion(_questionId,_questionData,_zindex);
          }
      })
      .catch(function(error) {
        //self.nextPage = 'error';
        self.message  = error;
        document.querySelector("star-app").set('route.path', "/error");
      });
  }
  
  _createQuestion(_questionId,_questionData,_zindex){
    var self=this;
    var options=[];
    if(_questionData.withOptions){
      var value;
      var map=_questionData.options;
      Object.keys(map).forEach(function(key) {
          value = map[key];
          options.push(value);
      });
    }
    var elem=document  .createElement('question-detail');
    elem.questionId     =_questionId;
    elem.title          =_questionData.question;
    elem.withOptions    =_questionData.withOptions;
    elem.background     =_questionData.background;
    
    elem.options        =options;
    elem.userUid        =self.user.uid;
    elem.avatar         =self.avatar;
    elem.nickname       =self.nickname;
    elem.team           =self.team;
    elem.area           =self.area;
    elem.zindex         =_zindex;
    elem.visible=true;  
    
    self.$.main.appendChild(elem);
    
    self.numQuestions++;    
  }
}

window.customElements.define('star-master', StarMaster);
