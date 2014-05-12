Ext.require([//
'desktop.ShortcutModel',//	
'desktop.StartMenu',//
'desktop.TaskBar',//
'desktop.TrayClock',//
'desktop.Wallpaper',//
'desktop.WebDesktop', //

'app.Notepad',//
'app.TabWindow',//
'app.Winn',//
'app.MM' ]);//

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
		return {
			xtype : 'taskbar',
			region : 'south',

			startBtnText : 'Debian',

			startApps : [ {
				text : 'MM',
				iconCls : 'notepad'
			} ],

			startConfig : {
				menu : [],
				title : 'App',
				iconCls : 'user',
				height : 300,
				width : 300
			}
		};
	}
});
