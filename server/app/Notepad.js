Ext.define('app.Notepad', {

	// extend : 'desktop.Module',

	id : 'notepad',

	launcher : {
		text : 'Notepad',
		iconCls : 'notepad'
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('notepad');

		if (!win) {
			win = desktop.createWindow({

				stateful : false,
				isWindow : true,
				constrainHeader : true,
				minimizable : true,
				maximizable : true,

				id : 'notepad',
				title : 'Notepad',
				width : 600,
				height : 400,
				iconCls : 'notepad',
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
					} ],
					id : 'tab_menu'
				}, {
					region : 'south',
					xtype : 'button',
					text : 'hola',
					width : 200,
					id : 'btn_hola'
				} ],

				_btn_hola : {
					click : function() {
						console.log('click');

					}
				},

				_btn_bt : {

					click : function() {
						// var fdist = btn_hola.getSize();
						console.log('fdist');
					}
				},
				listeners : {
					afterrender : function() {
						// this.self = this;
						var items = this.items.items

						for (var i = 0; i < items.length; i++) {
							var id = items[i].id;
							Ext.get(id).on(this['_' + id]);

							// self[id] = Ext.get(id);
							// self[id].on(this['_' + id]);
						}
					}
				}
			});

			win.doClose = function() {
				win.el.disableShadow();
				win.el.fadeOut({
					listeners : {
						afteranimate : function() {
							win.destroy();
						}
					}
				});
			};
			
			win.on({				
				minimize : function(win) {										
					win.hide();
				}
			});
			

		}
		return win;
	}
});
