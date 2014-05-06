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
		id : 'btn_bt2'
	}, {
		region : 'center',
		xtype : 'tabpanel',
		items : [ {
			title : 'Center Tab 1'
		} ],
		id : 'tab_menu2'
	}, {
		region : 'south',
		xtype : 'button',
		text : 'hola',
		width : 200,
		id : 'btn_hola2'
	} ],

	/*
	 * _btn_hola : { click : function() { console.log('click MM');
	 *  } },
	 * 
	 * _btn_bt : {
	 * 
	 * click : function() { // var fdist = btn_hola.getSize();
	 * console.log('click bt MM'); } },
	 */
	listeners : {
		/*
		 * afterrender : function() { // this.self = this; var items =
		 * this.items.items
		 * 
		 * for (var i = 0; i < items.length; i++) { var id = items[i].id;
		 * Ext.get(id).on(this['_' + id]);
		 *  // self[id] = Ext.get(id); // self[id].on(this['_' + id]); } },
		 */

		minimize : function(win) {
			win.hide();
		},

		close : function(win) {

			/*
			 * CHECAR EL FUNCIONAMINETO DEL EFECTO
			 */

			win.el.disableShadow();
			win.el.fadeOut({
				listeners : {
					afteranimate : function() {
						win.destroy();
					}
				}
			});
		}

	}

	
});
