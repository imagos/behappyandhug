
import '@polymer/polymer/polymer-element.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="shared-styles-main">
  <template>
    <style>
    .toolbar_main {
      background-color:#072146;
    }
    .container_top {
      padding-top: 150px;
    }
    .title-size {
      font-size: 1.5em
    }
    .title-margin-bottom {
      margin-bottom: 30px !important;
    }
    .isotipo {
      background-repeat: no-repeat;
      background-position: center;
      background-image: url(../images/isotipo_150x150.png);
      margin: 0px;
      margin-top: 15px;
      padding: 0px;
      height: 150px;
    }    
    
    .main_text {
      margin-top: 15px;
      margin-bottom: 15px;
    }
    
    .container {
      max-width: 450px;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
    }
        
    .width_100{
        margin: 0px !important;
        width: 100%;
    }
    .dataEntry{
        width: 80%;
        text-align: center;
        margin-left: auto;
        margin-right: auto;
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

    .card-actions{
      text-align: center;
      margin-top: 15px;
    }
    .button_verify{
      background-color: #00cece;
      color: white;
      width: 80%;
    }
    .avatar {
        width: 45px;
        height: 65px;
        border-radius: 10%;
        background-repeat: no-repeat;
        background-position: center;
        background-color: white;
        left: 0px;
        background-image: url(../images/avatars.png);
        display: inline-block;
        margin: 0px;
        padding: 0px;
    }
    .a1{
      background-position:  -8px -25px;
    }
    .a2{
      background-position: -47px -25px;
    }
    .a3{
      background-position: -86px -25px;
    }
    .a4{
      background-position: -125px -25px;
    }
    .a5{
      background-position: -164px -25px;
    }
    .a6{
      background-position: -203px -25px;
    }
    .a99{
      display: none !important;
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
    
    .options_container{
      margin: 0px;
      padding: 0px;
      background-color: #072146;          
      width: 100% !important;
    }
    .option_base {
      vertical-align:top;
      background-color: white;
      margin: 0px !important;
      width: 48%;
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
    .option_base:hover{
      background-color: #028484;
      color: #fff !important;
    }
    .option_base_img{
      height: 120px; /*or your image's height*/
      /*margin: 10px !important;*/
      background-repeat: no-repeat;
      background-position: center;
      background-size: 120px 120px;
      text-align: center;
      color: #1464A5;
    }
    .option_base_img:hover{
      color: #fff !important;
    }

    .option_title{
      margin: 5px !important;
      /*font-size: var(--lumo-font-size-s);*/
      color: inherit;
      text-align: center;
      font-size: 16px;
    }
    .option_title:hover {
      color: #fff !important;
    }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
