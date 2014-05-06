Ext.define('desktop.Wallpaper', {
	extend : 'Ext.Component',

	xtype : 'wallpaper',

	cls : 'ux-wallpaper',
	html : '<img src="' + Ext.BLANK_IMAGE_URL + '">',

	stretch : false,
	wallpaper : null,
	stateful : true,
	stateId : 'desk-wallpaper',

	afterRender : function() {
		var me = this;
		me.callParent();
		me.setWallpaper(me.wallpaper);
	},

	applyState : function() {
		var me = this, old = me.wallpaper;
		me.callParent(arguments);
		if (old != me.wallpaper) {
			me.setWallpaper(me.wallpaper);
		}
	},

	getState : function() {
		return this.wallpaper && {
			wallpaper : this.wallpaper
		};
	},

	setWallpaper : function(wallpaper) {

		var me = this, imgEl, bkgnd;

		me.wallpaper = wallpaper;

		if (me.rendered) {
			imgEl = me.el.dom.firstChild;

			if (!wallpaper || wallpaper == Ext.BLANK_IMAGE_URL) {
				Ext.fly(imgEl).hide();
			} else if (me.stretch) {
				imgEl.src = wallpaper;

				me.el.removeCls('ux-wallpaper-tiled');
				Ext.fly(imgEl).setStyle({
					width : '100%',
					height : '100%'
				}).show();
			} else {
				Ext.fly(imgEl).hide();

				bkgnd = 'url(' + wallpaper + ')';
				me.el.addCls('ux-wallpaper-tiled');
			}

			me.el.setStyle({
				backgroundImage : bkgnd || ''
			});
			if (me.stateful) {
				me.saveState();
			}
		}
		return me;
	}
});
