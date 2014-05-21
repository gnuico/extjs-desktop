Ext.define('system.taskbar.TaskBar', {
	extend : 'Ext.toolbar.Toolbar',

	xtype : 'taskbar',
	alias : 'widget.taskbar',
	cls : 'ux-taskbar',

	startBtnText : 'Start',
	startApps : [],
	startConfig : {},

	initComponent : function() {

		this.initApps();

		this.items = [//		             
		this.startmenu(),//
		'-', //
		this.windowBar(),// 
		'-',//
		this.trayclock() //		
		];

		this.callParent();
	},

	/*
	 * widgets
	 */

	startmenu : function() {

		var cfg = {
			xtype : 'button',
			cls : 'ux-start-button',
			iconCls : 'ux-start-button-icon',
			menuAlign : 'bl-tl',
			text : this.startBtnText
		};

		this.startConfig.menu = this.startApps;
		cfg.menu = new system.taskbar.StartMenu(this.startConfig);

		return cfg;
	},

	windowBar : function() {
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

	initApps : function() {
		var me = this;

		this.startApps.forEach(function(app) {
			app.handler = function() {
				var win = Ext.create(app.clazz);

				win.title = app.text;
				win.iconCls = app.iconCls;

				win.on({
					minimize : function(win) {
						win.hide();
					},
					close : function(win) {
						var wb = Ext.getCmp('windowbar');
						wb.remove(win.pid);
					}
				});
				var wb = Ext.getCmp('windowbar');
				wb.add(me.addTaskButton(win));
				win.show();
			};
		});
	},

	addTaskButton : function(win) {

		win.pid = 'sss';

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
	}
});
