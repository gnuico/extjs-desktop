Ext.define('app.App', {
	extend : 'desktop.App',

	init : function() {
		// custom logic before getXYZ methods get called...

		this.callParent();

		// now ready...
	},

	getModules : function() {
		return [ //
		new app.Notepad() //
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

			wallpaper : 'res/wallpapers/Blue-Sencha.jpg',
			wallpaperStretch : false
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
			width : 400
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
