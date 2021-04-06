define([
	"skylark-widgets-base/Widget",
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
			this.img = document.createWidget("img");
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