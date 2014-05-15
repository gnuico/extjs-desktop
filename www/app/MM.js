Ext.define('app.MM', {

	extend : 'Ext.window.Window',

	id : 'mm',

	launcher : {
		text : 'MM',
		iconCls : 'notepad'
	},

	stateful : false,
	isWindow : true,
	constrainHeader : true,
	minimizable : true,
	maximizable : true,
	closable : true,

	title : 'MM',
	width : 600,
	height : 400,

	animCollapse : false,
	border : false,
	hideMode : 'offsets',

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
	},

	listeners : {

		minimize : function(win) {
			win.hide();
		},

		close : function(win) {
			win.destroy();
		}
	}
});
