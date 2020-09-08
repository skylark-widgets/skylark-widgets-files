/**
 * skylark-widgets-files - The skylark file widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-files/
 * @license MIT
 */
define(["skylark-widgets-base/Widget","skylark-io-diskfs/select","./files"],function(e,t,i){"use strict";var s=e.inherit({_construct:function(i){e.prototype._construct.call(this,i,"div");var s=this.getSkin();this.img=document.createWidget("img"),this.img.style.visibility="inherit",this.img.style.position="absolute",this.img.style.borderStyle="none",this.img.style.left="0px",this.img.style.top="0px",this.img.style.width="100%",this.img.style.height="100%",this.img.style.objectFit="contain",this.img.style.backgroundImage='url("'+s.alphaImageUrl+'")',this.img.style.backgroundRepeat="repeat",this.img.style.backgroundSize="120px 120px",this._elm.appendChild(this.img),this.value=null;var a=this;this._elm.ondragover=e.preventDefault,this._elm.ondragstart=e.preventDefault,this._elm.ondrop=function(e){if(e.preventDefault(),e.dataTransfer.files.length>0){var t=e.dataTransfer.files[0];Image.fileIsImage(t)&&n(t)}else{var i=e.dataTransfer.getData("uuid"),s=DragBuffer.get(i);s instanceof Image?(a.setValue(s),a.onChange(s)):Editor.alert("Only images accepted")}},this._elm.onclick=function(){null!==a.onChange&&t({picked:function(e){e.length>0&&n(e[0])}})};var n=function(e){var t=new FileReader;t.onload=function(){a.setValue(new Image(t.result)),a.onChange(a.value)},t.readAsDataURL(e)};this.onChange=null},setOnChange:function(e){this.onChange=e,this.img.style.cursor="pointer"},setValue:function(e){this.value=e,this.img.src=e.data},getValue:function(){return this.value}});return i.ImageChooser=s});
//# sourceMappingURL=sourcemaps/ImageChooser.js.map
