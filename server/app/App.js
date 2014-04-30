Ext.define('app.App', {
	extend : 'desktop.App',

	init : function() {
		// custom logic before getXYZ methods get called...

		this.callParent();

		// now ready...
	},

	getModules : function() {
		return [ //
		new app.Notepad(), //
		new app.TabWindow()
		];//
	},

	getDesktopConfig : function() {
		var me = this, ret = me.callParent();

		return Ext.apply(ret, {
			// cls: 'ux-desktop-black',

			contextMenuItems : [ {
				text : 'Change Settings',
				handler : me.onSettings,
				scope : me
			} ],

			shortcuts : Ext.create('Ext.data.Store', {
				model : 'desktop.ShortcutModel',
				data : [ {
					name : 'Notepad',
					iconCls : 'notepad-shortcut',
					module : 'notepad'
				} ]
			}),

			wallpaper : 'res/wallpapers.png',
			wallpaperStretch : true
		});
	},

	// config for the start menu
	getStartConfig : function() {
		var me = this;
		ret = me.callParent();

		return Ext.apply(ret, {
			title : 'Don Griffin',
			iconCls : 'user',
			height : 300,
			width : 300
		});
	},

	getTaskbarConfig : function() {
		var ret = this.callParent();

		return Ext.apply(ret, {
			quickStart : [ {
				name : 'Notepad',
				iconCls : 'accordion',
				module : 'notepad'
			} ],
			trayItems : [ {
				xtype : 'trayclock',
				flex : 1
			} ]
		});
	},

});
