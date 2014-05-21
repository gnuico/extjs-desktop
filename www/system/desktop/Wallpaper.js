Ext.define('system.desktop.Wallpaper', {
	extend : 'Ext.Component',

	xtype : 'wallpaper',
	cls : 'ux-wallpaper',
	html : '<img src="' + Ext.BLANK_IMAGE_URL + '">',

	wallpaper : null,

	afterRender : function() {
		var imgEl = this.el.dom.firstChild;
		imgEl.src = this.wallpaper;

		//this.el.removeCls('ux-wallpaper-tiled');
		Ext.fly(imgEl).setStyle({
			width : '100%',
			height : '100%'
		}).show();
	}
});
