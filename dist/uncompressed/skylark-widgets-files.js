/**
 * skylark-widgets-files - The skylark file widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-files/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-widgets-files/files',[
	"skylark-langx/skylark"
],function(skylark){
	return skylark.attach("widgets.files",{});
});
define('skylark-widgets-files/image-chooser',[
	"skylark-widgets-base/widget",
    "skylark-io-diskfs/select",
    "./files"
],function(
	Widget,
	select,
	files
){
	"use strict";

	/**
	 * Image chooser is used for the user to select images.
	 *
	 * Images can be selected by opening a file explorer or by drag and drop.
	 *
	 * @class ImageChooser
	 * @extends {Widget}
	 */
	 var ImageChooser = Widget.inherit({
		"_construct" : function (parent)
		{
			Widget.prototype._construct.call(this, parent, "div");

			var skin = this.getSkin();

			//Image
			this.img = document.createElement("img");
			this.img.style.visibility = "inherit";
			this.img.style.position = "absolute";
			this.img.style.borderStyle = "none";
			this.img.style.left = "0px";
			this.img.style.top = "0px";
			this.img.style.width = "100%";
			this.img.style.height = "100%";
			this.img.style.objectFit = "contain";
			//this.img.style.backgroundImage = "url(\"" + Global.FILE_PATH + "alpha.png\")";
			this.img.style.backgroundImage = "url(\"" + skin.alphaImageUrl + "\")";
			this.img.style.backgroundRepeat = "repeat";
			this.img.style.backgroundSize = "120px 120px";
			this._elm.appendChild(this.img);

			//Value
			this.value = null;

			var self = this;

			this._elm.ondragover = Widget.preventDefault;
			this._elm.ondragstart = Widget.preventDefault;

			//On drop get file dropped
			this._elm.ondrop = function(event)
			{
				event.preventDefault();

				if(event.dataTransfer.files.length > 0)
				{
					var file = event.dataTransfer.files[0];

					if(Image.fileIsImage(file))
					{
						readImageFile(file);
					}
				}
				else
				{
					var uuid = event.dataTransfer.getData("uuid");
					var value = DragBuffer.get(uuid);

					if(value instanceof Image)
					{
						self.setValue(value);
						self.onChange(value);
					}
					else
					{
						Editor.alert("Only images accepted");
					}
				}
			};

			//Onclick select image file
			this._elm.onclick = function()
			{
				if(self.onChange !== null)
				{
					select({
						picked : function(files) {
							if(files.length > 0) {
								readImageFile(files[0]);
							}
						}   //, "image/*, .tga");
					});
				}
			};

			var readImageFile = function(file)
			{
				var reader = new FileReader();
				reader.onload = function()
				{
					self.setValue(new Image(reader.result));
					self.onChange(self.value);
				};
				reader.readAsDataURL(file);
			};

			/**
			 * On change callback function.
			 *
			 * @property onChange
			 * @type {Function}
			 */
			this.onChange = null;
		},


		/**
		 * Set onchange callback, called after changes.
		 *
		 * @method setOnChange
		 * @param {Function} onChange
		 */
		setOnChange : function(onChange)
		{
			this.onChange = onChange;
			this.img.style.cursor = "pointer";
		},

		/**
		 * Set value stored in the input element.
		 *
		 * @method setValue
		 * @param {Object} image
		 */
		setValue : function(image)
		{
			this.value = image;
			this.img.src = image.data;
		},

		/**
		 * Get value stored in the input element.
		 *
		 * @method setValue
		 * @return {Object} Image URL.
		 */
		getValue : function() 	{
			return this.value;
		}

	 });

	return files.ImageChooser = ImageChooser;
});
define('skylark-widgets-files/main',[
	"./files",
	"./image-chooser"
],function(files){
	return files;
});
define('skylark-widgets-files', ['skylark-widgets-files/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-widgets-files.js.map
