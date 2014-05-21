Ext.define('system.sys.User', {
	extend : 'system.lib.Window',

	width : 600,
	height : 400,

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
		} ]
	}, {
		region : 'south',
		xtype : 'button',
		text : 'hola',
		width : 200,
		id : 'btn_hola'
	} ],

	initComponent : function() {

		this.callParent();

		var me = this;
		Ext.each(this.items.items, function(item) {
			Ext.getCmp(item.id).on(me['_' + item.id]);
		});

	},

	_btn_hola : {
		click : function() {
			console.log('click MM');
		}
	},

	_btn_bt : {
		click : function() { // var fdist = btn_hola.getSize();
			console.log('click bt MM');
		}
	}
});
