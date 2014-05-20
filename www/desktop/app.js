Ext.require([//

'desktop.ShortcutModel',//	
'desktop.StartMenu',//
'desktop.TaskBar',//
'desktop.TrayClock',//
'desktop.Wallpaper',//

'app.User',//
'app.Notepad',//
'app.TabWindow',//
'app.Winn',//

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
				clazz : 'app.User',
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
