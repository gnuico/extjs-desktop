Ext.define('desktop.TaskBar', {
	extend : 'Ext.toolbar.Toolbar',

	xtype : 'taskbar',
	alias : 'widget.taskbar',
	cls : 'ux-taskbar',

	startBtnText : 'Start',
	startApps : [],
	startConfig : {},

	initComponent : function() {

		this.items = [ this.startmenu(), '-', this.windowBar(), '-',
				this.trayclock() ];

		this.callParent();

		
	},

	/*
	 * widgets
	 */

	startmenu : function() {
		var me = this;
		var cfg = {
			id : 'b',
			xtype : 'button',
			cls : 'ux-start-button',
			iconCls : 'ux-start-button-icon',
			menuAlign : 'bl-tl',
			text : this.startBtnText
		};

		Ext.each(this.startApps, function(app) {
			app.handler = function() {
				var win = Ext.create('app.' + app.text);
				me.addTaskButton(win);
				win.show();
				
				tb = Ext.getCmp('tb');
				tb.add('s');

			};
			me.startConfig.menu.push(app);
		});

		cfg.menu = new desktop.StartMenu(this.startConfig);

		return cfg;
	},

	windowBar : function() {
		return {
			id : 'tb',
			xtype : 'toolbar',
			flex : 1,
			cls : 'ux-desktop-windowbar',
			layout : {
				overflowHandler : 'Scroller'
			}
		};
	},

	trayclock : function() {
		return {
			xtype : 'trayclock'
		};
	},

	listeners : {
		afterrender : function() {
			var a = Ext.getCmp('tb');

		}
	},

	/*
	 * 
	 * 
	 * 
	 * 
	 */

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

	addTaskButton : function(win) {
		var config = {
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

	removeTaskButton : function(btn) {
		var found, me = this;
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
