Ext.require([//
	
'system.taskbar.StartMenu',//
'system.taskbar.TaskBar',//
'system.taskbar.TrayClock',//

'system.desktop.Wallpaper',//

'system.lib.Window',//

'system.sys.User',//

]);//

Ext.application({
	name : 'app',
	extend : 'Ext.container.Viewport',

	layout : 'border',

	constructor : function() {
		this.callParent();
	},

	initComponent : function() {
		this.items = [

		this.wallpaper(), //
		this.taskbar() //

		];

		this.callParent();
	},

	/*
	 * widgets
	 */

	wallpaper : function() {
		return {
			xtype : 'wallpaper',
			region : 'center',
			wallpaper : 'res/wallpaper.png'
		};
	},

	taskbar : function() {
		var cfg = {
			xtype : 'taskbar',
			region : 'south',

			startBtnText : 'Debian',

			startApps : [ {
				clazz : 'system.sys.User',
				text : 'User',
				iconCls : 'notepad'
			} ],

			startConfig : {
				menu : [],
				title : 'App',				
				height : 300,
				width : 300
			}
		};
		return cfg;
	}
});
