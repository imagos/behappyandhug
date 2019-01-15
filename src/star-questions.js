import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import './shared-styles-main.js';
import './star-share.js';

class StarQuestions extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles-main">
        :host {
          display: block;
          font-family: 'Roboto Condensed', sans-serif;
          text-align: center !important;
          min-height: 90vh;
        }
        [hidden] {
          display: none;
         }
        .transbox {
          background-color: rgba(0,0,0,0.5);
          height: 100%;
        }
        .container_dots{
          text-align:right;
        } 
        .dots:after {
          content: '\\2807';
          font-size: 2em;
        }
      </style>
      <div id="main" class="container" hidden$="{{visibleShare}}">
        <div class="paper-header" style$='background-image: url({{background}});'>
          <div class="transbox"> 
              <div class="container_dots">
                <div class="dots" on-tap="_openTips"></div>
              </div>
              <div class="p_header"  on-tap="_openTips">{{title}}</div>
          </div>
        </div>
        <div class="options_container">
            <template is="dom-repeat" items="[[options]]">
                {{_addNumOptions()}}
                <div class='option_base' data='{{item.text}}' on-tap='_checkOption'>
                    <div data='{{item.value}}' class="option_base_img" style$='background-image: url({{item.icon}});' >&nbsp;</div>  
                    <div class="option_title">{{item.text}}</div>
                </div>
            </template>
        </div>
        
        <paper-dialog id="pdTips">
          <paper-dialog-scrollable>
            <table id="textPaperDialog">
            </table>
          </paper-dialog-scrollable>
          <div class="buttons">
            <paper-button dialog-confirm autofocus>Cerrar</paper-button>
          </div>
        </paper-dialog>
        
      </div>
      <star-share hidden$="{{!visibleShare}}" user=[[user]] message={{message}} next-page={{nextPage}}></star-share>
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
      visibleShare: { type: Boolean,    notify: true,   value:false}
    };
  }
  ready(){
    super.ready();
    db.settings({timestampsInSnapshots: true});
    console.log(this.user);
    console.log('AREA: ' + this.area);
    console.log('TEAM: ' + this.team);
    console.log('NICKNAME: ' + this.nickname);
    console.log('AVATAR: ' + this.avatar);
    this._loadQuestion();
  }

  _getToday(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    
    if(dd<10) {
        dd = '0'+dd
    } 
    if(mm<10) {
        mm = '0'+mm
    } 
    today = yyyy + '-' + mm + '-' + dd;
    return today;
  }

  _loadQuestion(){
    var self=this;
    if(!this.area){
      this.nextPage="login";
      return;
    }
    db.collection("questions").where("active","==",true).where("area","==",self.area).limit(1)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            self._verifyAnswer(doc.id, doc.data());
          });
      })
      .catch(function(error) {
        self.nextPage = 'error';
        self.message  = error;
      });

  }
  _verifyAnswer(_questionId,_questionData,_zindex){
    var self=this;
    var existsAnswer=false;
    var today=self._getToday();
    db.collection("answers").where("questionId","==",_questionId).where("uid","==",self.user.uid).where("date","==",today)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            existsAnswer=true;
          });
          if(existsAnswer){
            self.visibleShare=true;
            console.info('share visible');
          }else{
            self._createQuestion(_questionId,_questionData);
          }
      })
      .catch(function(error) {
        self.nextPage = 'error';
        self.message  = error;
      });
  }
  
  _createQuestion(_questionId,_questionData){
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
    self.questionId     =_questionId;
    self.title          =_questionData.question;
    self.withOptions    =_questionData.withOptions;
    self.background     =_questionData.background;
    
    self.options        =options;
    self.userUid        =self.user.uid;
    self.avatar         =self.avatar;
    self.nickname       =self.nickname;
    self.team           =self.team;
    self.area           =self.area;
    self.visible=true;  
  }
  
  _checkOption(e){
    console.log(e);
    var self=this;
    var text;
    var path = e.path || (e.composedPath && e.composedPath()); 
    text=path[0].data;  
    // if(path){
    //   text=e.path[0].data;  
    // }else{
    //   text=e.explicitOriginalTarget.data;      
    // }
    
    var _date=self._getToday();
    console.log("text ==> " + text);
    console.log("self.userUid ==> " + self.userUid);
    console.log("self.questionId ==> " + self.questionId);
    console.log("self.area ==> " + self.area);
    console.log("self.team ==> " + self.team);
    
    db.collection("answers").add({
        uid:        self.userUid,
        questionId: self.questionId,
        text:       text,
        team:       self.team,
        area:       self.area,
        date:       _date,
        registerDate: firebase.firestore.Timestamp.now()
    })
    .then(function(docRef) {
        self.nextPage="share";
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        self.nextPage="error";
        self.message=error;
        console.error("Error adding document: ", error);
    });
  }

  _addNumOptions(){
    this.numOptions++;
    if(this.numOptions%2!=0){
      this.flagNewLine=true;
    }else{
      this.flagNewLine=false;  
    }
  }
  _openTips(){
    var table=this.$.textPaperDialog;
    var tableRows = table.getElementsByTagName('tr');
    var rowCount = tableRows.length;
    if (rowCount>0){
      table.innerHTML="";
    }
    this.options.forEach(function(element) {
      var row = table.insertRow(0);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      cell1.innerHTML = "<img src="+ element.icon +" style='width:80px;height:80px;'><br><b>" + element.text + "<b> " ;  
      cell2.innerHTML = element.description;
    });
    this.$.pdTips.open();
  }
}

window.customElements.define('star-questions', StarQuestions);
