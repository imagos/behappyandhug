
import '@polymer/polymer/polymer-element.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="shared-styles-main">
  <template>
    <style>
    .avatar {
        width: 39px;
        height: 39px;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center;
        left: 0px;
        background-image: url(../images/avatars.png);
        display: inline-block;
        margin: 0px;
        padding: 0px;
    }
    .a1{
      background-position: -10px -10px;
    }
    .a2{
      background-position: -70px -10px;
    }
    .a3{
      background-position: -130px -10px;
    }
    .inline {
      display: inline-block !important;
    }
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
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
