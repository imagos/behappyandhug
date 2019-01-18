import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import './post-detail.js';

class QuestionDetail extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
        <style>
        /* Font families */
        --lumo-font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe 
        /* Font sizes */
        --lumo-font-size-s: .875rem;
        :host {
            display: block;
            font-family: 'Roboto Condensed', sans-serif;
        }
        .paper-header {
          font-size: 26px;
          line-height: 50px;
          color: white;
          transition: height 0.2s;
          background-color: #004481;
          /*border-radius: 5px;*/
          height: 250px; /* You must set a specified height */
          background-position: center; /* Center the image */
          background-repeat: no-repeat; /* Do not repeat the image */
          background-size: cover;
        }
        .paper-header-share{
          height:100px !important;
          padding-bottom: 40px !important;
        }
        .p_header_share {
          vertical-align: text-bottom;
          text-align: center;
          padding-top: 50px;
        }
        .p_header {
          vertical-align: text-bottom;
          text-align: center;
          padding-top: 70px;
          text-shadow: -1px 0 #888888, 0 1px #888888, 1px 0 #888888, 0 -1px #888888;
        }
        .options_container{
          margin: 0px;
          padding: 0px;
          background-color: #072146;          
          width: 100% !important;
        }
        .card {
          margin: 0px;
          padding: 0px;
          background-color: #072146;
          position: absolute;
          width: 100%;
          /*border-radius: 5px;*/
          /*box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);*/
        }
        .kudo_base {
          vertical-align:top;
          background-color: white;
          margin: 0px !important;
          width: 49%;
          display: inline-block;
          cursor: pointer;
          height: 180px;
          text-align: center;
          margin-bottom:8px;
          border-top-style: solid;
          border-top-color: #072146;
          border-top-width: 1px;
          border-bottom-style: solid;
          border-bottom-color: #072146;
          border-bottom-width: 1px;
          color: #1464A5;
        }
        .kudo_base:hover{
          background-color: #028484;
          color: #fff !important;
        }
        .kudo_base_img{
          height: 120px; /*or your image's height*/
          /*margin: 10px !important;*/
          background-repeat: no-repeat;
          background-position: center;
          background-size: 120px 120px;
          text-align: center;
          color: #1464A5;
        }
        .kudo_base_img:hover{
          color: #fff !important;
        }
        .kudo_enable{
          background-color: #82c82d;
        }
        .kudo_disable{
          background-color: #cccccc;
        }
        .kudo_title{
          margin: 5px !important;
          /*font-size: var(--lumo-font-size-s);*/
          color: inherit;
          text-align: center;
          font-size: 16px;
        }
        .kudo_title:hover {
          color: #fff !important;
        }

        .textarea{
          font-size: 16px;
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
          padding-top: 40px;
          text-align: center;
          background-color: white;
        }
        [hidden] {
          display: none;
         }
        .container_dots{
          text-align:right;
        } 
        .dots:after {
          content: '\\2807';
          font-size: 2em;
        }
        </style>
        <div id="postWall">
        </div>
        <div class="card" hidden="[[!visible]]" style$="z-index:[[zindex]]">
          <div hidden="[[toShare]]">  
            <div class="paper-header" style$='background-image: url({{background}});'>
              <div class="container_dots">
                <div class="dots" on-tap="_openTips"></div>
              </div>
              <p class="p_header" on-tap="_openTips">{{title}}</p>
            </div>
            
            <template is="dom-repeat" items="[[options]]">
                {{_addNumOptions()}}
                <div class='kudo_base' data='{{item.text}}' on-tap='checkOption'>
                    <div data='{{item.value}}' class="kudo_base_img" style$='background-image: url({{item.icon}});' >&nbsp;</div>  
                    <div class="kudo_title">{{item.text}}</div>
                </div>
                <template is="dom-if" if="[[flagNewLine]]">
                  <div class="options_container">
                  </div>
                </template>
            </template>
          </div>
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
`;
  }

  static get is() { return 'question-detail'; }
  static get properties() {
      return {
          user:       { type: Object,   notify: true },
          avatar:     { type: String,   notify: true },
          nickname:   { type: String,   notify: true },
          team:       { type: String,   notify: true },
          questionId: { type: String,   notify: true },
          background: { type: String,   notify: true },
          options:    { type: Array,    notify: true, value: function() { return []; }},
          title:      { type: String,   notify: true },
          withOptions:{ type: Boolean,  notify: true, value:false },
          numOptions: { type: Number,   notify: true, value: 0    },
          flagNewLine:{type: Boolean,  notify: true,    value: true },
          visible:    { type: Boolean,  notify: true,   value: true,  reflectToAttribute: true, },
          message:    {type: String,    notify: true,   reflectToAttribute: true,},
          nextPage:   {type: String,    notify: true,   reflectToAttribute: true,},
      };
  }
  ready(){
    super.ready();
    db.settings({timestampsInSnapshots: true});
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
  
  checkOption(e){
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
        self.visible=false;
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        //self.nextPage="error";
        self.message=error;
        document.querySelector("star-app").set('route.path', "/error");
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

window.customElements.define(QuestionDetail.is, QuestionDetail);
