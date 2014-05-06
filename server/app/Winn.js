Ext.define('app.Winn', {
	extend : 'Ext.container.Container',

	xtype : 'winn',
	layout : 'border',

	items : [ {
		region : 'west',
		xtype : 'button',
		width : 150,
		text : 'btnjjjjjjjj',
		id : 'btn_bt'
	}, {
		region : 'center',
		xtype : 'tabpanel',
		items : [ {
			title : 'Center Tab 1'
		} ],
		id : 'tab_menu'
	}, {
		region : 'south',
		xtype : 'button',
		text : 'hola',
		width : 200,
		id : 'btn_hola'
	} ]

});