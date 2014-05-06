Ext.define('desktop.TaskBar', {
	extend : 'Ext.toolbar.Toolbar',

	xtype : 'tb',

	alias : 'widget.taskbar',

	cls : 'ux-taskbar',

	startBtnText : 'Start',

	initComponent : function() {
		var me = this;

		me.startMenu = new desktop.StartMenu(me.startConfig);

		me.quickStart = new Ext.toolbar.Toolbar(me.getQuickStart());

		me.windowBar = new Ext.toolbar.Toolbar(me.getWindowBarConfig());

		me.tray = new Ext.toolbar.Toolbar(me.getTrayConfig());

		me.items = [ {
			xtype : 'button',
			cls : 'ux-start-button',
			iconCls : 'ux-start-button-icon',
			menu : me.startMenu,
			menuAlign : 'bl-tl',
			text : me.startBtnText
		}, me.quickStart, {
			xtype : 'splitter',
			html : '&#160;',
			height : 14,
			width : 2, // TODO - there should be a CSS way here
			cls : 'x-toolbar-separator x-toolbar-separator-horizontal'
		}, me.windowBar, '-', me.tray ];

		me.callParent();
	},

	afterLayout : function() {
		var me = this;
		me.callParent();
		me.windowBar.el.on('contextmenu', me.onButtonContextMenu, me);
	},

	getQuickStart : function() {
		var me = this, ret = {
			minWidth : 20,
			width : Ext.themeName === 'neptune' ? 70 : 60,
			items : [],
			enableOverflow : true
		};

		Ext.each(this.quickStart, function(item) {
			ret.items.push({
				tooltip : {
					text : item.name,
					align : 'bl-tl'
				},
				// tooltip: item.name,
				overflowText : item.name,
				iconCls : item.iconCls,
				module : item.module,
				handler : me.onQuickStartClick,
				scope : me
			});
		});

		return ret;
	},

	getTrayConfig : function() {
		var ret = {
			items : this.trayItems
		};
		delete this.trayItems;
		return ret;
	},

	getWindowBarConfig : function() {
		return {
			flex : 1,
			cls : 'ux-desktop-windowbar',
			items : [ '&#160;' ],
			layout : {
				overflowHandler : 'Scroller'
			}
		};
	},

	getWindowBtnFromEl : function(el) {
		var c = this.windowBar.getChildByElement(el);
		return c || null;
	},

	onQuickStartClick : function(btn) {
		var module = this.app.getModule(btn.module), window;

		if (module) {
			window = module.createWindow();
			window.show();
		}
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

		var cmp = this.windowBar.add(config);
		cmp.toggle(true);
		return cmp;
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
