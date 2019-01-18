import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles-main.js';
import './post-detail.js';

class StarWall extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles-main">
        :host {
          display: block;
          padding: 0px;
          font-family: 'Roboto Condensed', sans-serif;
        }
      </style>
      
      <div id="postWall" class="container">
      </div>
    `;
  }
  static get properties() {
    return {
      user:           { type: Object,   notify: true },
      avatar:         { type: String,   notify: true },
      nickname:       { type: String,   notify: true },
      team:           { type: String,   notify: true },
      area:           { type: String,   notify: true },
      activeComments: { type: Boolean,  notify: true, value: false, reflectToAttribute: true  },
    };
  }
  ready(){
    super.ready();
    db.settings({timestampsInSnapshots: true});
    console.log('cargando');
    this._loadlistReport();
  }
  
  _createPost(data){
    var elem=document.createElement('post-detail');
    var _row=data;
    elem.post=_row;
    elem.nickname = this.nickname;
    elem.avatar   = this.avatar;
    elem.userUid  = this.user.uid;
    elem.team     = this.team;
    //elem.getAnswers();
    this.$.postWall.appendChild(elem);
  }

  _loadlistReport(){
    var self=this;
    this.$.postWall.innerHTML="";
    db.collection("posts").where("area","==",self.area).orderBy("registerDate","desc")
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

window.customElements.define('star-wall', StarWall);
