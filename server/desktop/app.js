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

l = function(str) {
	console.log(str);
};

Ext.application({
	name : 'app',
	extend : 'Ext.container.Viewport',

	layout : {
		type : 'fit'
	},

	items : [ {
		xtype : 'webdesktop'
	} ],

	constructor : function() {
		this.callParent();
	}
});
