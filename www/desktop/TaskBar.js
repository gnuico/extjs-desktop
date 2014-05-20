Ext.define('desktop.TaskBar', {
	extend : 'Ext.toolbar.Toolbar',

	xtype : 'taskbar',
	alias : 'widget.taskbar',
	cls : 'ux-taskbar',

	startBtnText : 'Start',
	startApps : [],
	startConfig : {},


	initComponent : function() {

		this.items = [ 

			this.startmenu(), 
			'-', 
			this.windowBar(), 
			'-',
			this.trayclock() 
		];

		this.callParent();	

		this.wb = Ext.getCmp('windowbar');	
	},

	/*
	 * widgets
	 */

	startmenu : function() {
		var me = this;
		

		this.startApps.forEach(function(app) {
			app.handler = function() {		
				var win = Ext.create(app.clazz);

				win.title=app.text;
				win.iconCls=app.iconCls;

				win.on({
					destroy : function(win) {
						var wb = Ext.getCmp('windowbar');
						wb.remove(win.pid);
					},
				});				
				me.wb.add(me.addTaskButton(win));
				win.show();
			};			
		});

		var cfg = {
			id : 'b',
			xtype : 'button',
			cls : 'ux-start-button',
			iconCls : 'ux-start-button-icon',
			menuAlign : 'bl-tl',
			text : this.startBtnText
		};
		cfg.menu = new desktop.StartMenu(this.startConfig);

		return cfg;
	},

	windowBar : function() {
		var me = this;
		var cfg = {
			id : 'windowbar',
			xtype : 'toolbar',
			flex : 1,
			cls : 'ux-desktop-windowbar',
			layout : {
				overflowHandler : 'Scroller'
			}
		};


		

		return cfg;
	},

	trayclock : function() {
		return {
			xtype : 'trayclock'
		};
	},

	/*
	 * 
	 * 
	 * 
	 * 
	 */


	addTaskButton : function(win) {

		win.pid='sss';

		var config = {	
			id : win.pid,
			iconCls : win.iconCls,
			enableToggle : true,
			toggleGroup : 'all',
			width : 140,
			margins : '0 2 0 3',
			text : Ext.util.Format.ellipsis(win.title, 20),
			listeners : {
				click : this.onWindowBtnClick,
				scope : this
			},
			win : win			
		};

		return config;
	},



	onWindowBtnClick : function(btn) {
		var win = btn.win;

		if (win.minimized || win.hidden) {
			btn.disable();
			win.show(null, function() {
				btn.enable();
			});
		} else if (win.active) {
			btn.disable();
			win.on('hide', function() {
				btn.enable();
			}, null, {
				single : true
			});
			win.minimize();
		} else {
			win.toFront();
		}
	},


	removeTaskButton : function(btn) {
		var found;
		var me = this;

		me.windowBar.items.each(function(item) {
			if (item === btn) {
				found = item;
			}
			return !found;
		});
		if (found) {
			me.windowBar.remove(found);
		}
		return found;
	},









	afterLayout : function() {
		var me = this;
		me.callParent();
		// me.windowBar().el.on('contextmenu', me.onButtonContextMenu, me);
	},

	getWindowBtnFromEl : function(el) {
		var c = this.windowBar.getChildByElement(el);
		return c || null;
	},

	onButtonContextMenu : function(e) {
		var me = this, t = e.getTarget(), btn = me.getWindowBtnFromEl(t);
		if (btn) {
			e.stopEvent();
			me.windowMenu.theWin = btn.win;
			me.windowMenu.showBy(t);
		}
	},





	setActiveButton : function(btn) {
		if (btn) {
			btn.toggle(true);
		} else {
			this.windowBar.items.each(function(item) {
				if (item.isButton) {
					item.toggle(false);
				}
			});
		}
	}
});
