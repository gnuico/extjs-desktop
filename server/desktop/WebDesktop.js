Ext.define('desktop.WebDesktop',
		{
			extend : 'Ext.panel.Panel',
			xtype : 'webdesktop',

			modules : null,
			useQuickTips : true,

			activeWindowCls : 'ux-desktop-active-win',
			inactiveWindowCls : 'ux-desktop-inactive-win',
			lastActiveWindow : null,

			layout : 'fit',

			xTickSize : 1,
			yTickSize : 1,

			app : null,
			shortcuts : null,
			shortcutTpl : [ '<tpl for=".">',
					'<div class="ux-desktop-shortcut" id="{name}-shortcut">',
					'<div class="ux-desktop-shortcut-icon {iconCls}">',
					'<img src="', Ext.BLANK_IMAGE_URL, '" title="{name}">',
					'</div>',
					'<span class="ux-desktop-shortcut-text">{name}</span>',
					'</div>', '</tpl>', '<div class="x-clear"></div>' ],

			windowMenu : null,
			lst_windows : Object,

			constructor : function() {
				var me = this;
				this.lst_windows = new Ext.util.MixedCollection();

				if (me.useQuickTips) {
					Ext.QuickTips.init();
				}

				me.modules = me.getModules();
				if (me.modules) {
					Ext.each(me.modules, function(module) {
						module.app = me;
					});
				}

				this.app = me;

				this.callParent();
			},

			initComponent : function() {

				this.windowMenu = new Ext.menu.Menu({
					defaultAlign : 'br-tr',

					items : [ {
						text : 'Restore',
						handler : function() {
							var win = this.windowMenu.theWin;
							this.restoreWindow(win);
						},
						scope : this
					}, {
						text : 'Minimize',
						handler : function() {
							var win = this.windowMenu.theWin;
							win.minimize();
						},
						scope : this
					}, {
						text : 'Maximize',
						handler : function() {
							var win = this.windowMenu.theWin;
							win.maximize();
							win.toFront();
						},
						scope : this
					}, '-', {
						text : 'Close',
						handler : function() {
							var win = this.windowMenu.theWin;
							win.close();
						},
						scope : this
					} ],
					listeners : {
						beforeshow : function(menu) {
							var items = menu.items.items, win = menu.theWin;
							items[0].setDisabled(win.maximized !== true
									&& win.hidden !== true); // Restore
							items[1].setDisabled(win.minimized === true); // Minimize
							items[2].setDisabled(win.maximized === true
									|| win.hidden === true); // Maximize
						},
						hide : function(menu) {
							Ext.defer(function() {
								menu.theWin = null;
							}, 1);
						},
						scope : this
					}
				});

				this.taskbar = new desktop.TaskBar({
					app : this,
					startConfig : this.getStartConfig(),

					quickStart : [ {
						name : 'Notepad',
						iconCls : 'accordion',
						module : 'notepad'
					} ],
					trayItems : [ {
						xtype : 'trayclock',
						flex : 1
					} ]
				});

				this.taskbar.windowMenu = this.windowMenu;
				this.bbar = this.taskbar;

				this.items = [ {
					xtype : 'wallpaper',
					stretch : true,
					wallpaper : 'res/wallpaper.png'
				}, {
					xtype : 'dataview',
					overItemCls : 'x-view-over',
					trackOver : true,
					itemSelector : 'div.ux-desktop-shortcut',
					store : Ext.create('Ext.data.Store', {
						model : 'desktop.ShortcutModel',
						data : [ {
							name : 'Notepad W',
							iconCls : 'notepad-shortcut',
							module : 'notepad'
						}, {
							name : 'MM',
							iconCls : 'notepad-shortcut',
							module : 'mm'
						} ]
					}),
					style : {
						position : 'absolute'
					},
					x : 0,
					y : 0,
					tpl : new Ext.XTemplate(this.shortcutTpl)
				} ];

				this.callParent();

				this.shortcutsView = this.items.getAt(1);

				this.shortcutsView.on('itemclick',

				function(dataView, record) {

					var module = this.app.getModule(record.data.module);
					var win = module && module.createWindow();

					if (win) {
						this.restoreWindow(win);
					}
				}, this);

			},

			restoreWindow : function(win) {
				if (win.isVisible()) {
					win.restore();
					win.toFront();
				} else {
					win.show();
				}
				return win;
			},

			createWindow : function(config) {

				var win = new Ext.window.Window(config);
				this.add(win);

				this.lst_windows.add(win);

				win.taskButton = this.taskbar.addTaskButton(win);
				win.animateTarget = win.taskButton.el;

				win.on({
					activate : this.updateActiveWindow,
					beforeshow : this.updateActiveWindow,
					deactivate : this.updateActiveWindow,

					destroy : function(win) {

						this.lst_windows.remove(win);
						this.taskbar.removeTaskButton(win.taskButton);
						this.updateActiveWindow();
					},

					boxready : function() {
						win.dd.xTickSize = this.xTickSize;
						win.dd.yTickSize = this.yTickSize;
						if (win.resizer) {
							win.resizer.widthIncrement = this.xTickSize;
							win.resizer.heightIncrement = this.yTickSize;
						}
					},

					scope : this
				});

				return win;
			},

		

			getWindow : function(id) {
				return this.lst_windows.get(id);
			},

			updateActiveWindow : function() {
				var activeWindow = null;

				var win = null;
				var zmgr = (this.lst_windows.getCount() && this.lst_windows
						.getAt(0).zIndexManager)
						|| null;

				if (zmgr) {
					// We cannot rely on activate/deactive because that
					// fires against non-Window
					// components in the stack.

					zmgr.eachTopDown(function(comp) {
						if (comp.isWindow && !comp.hidden) {
							win = comp;
							return false;
						}
						return true;
					});
				}

				activeWindow = win;

				var last = this.lastActiveWindow;
				if (activeWindow === last) {
					return;
				}

				if (last) {
					if (last.el.dom) {
						last.addCls(this.inactiveWindowCls);
						last.removeCls(this.activeWindowCls);
					}
					last.active = false;
				}

				this.lastActiveWindow = activeWindow;

				if (activeWindow) {
					activeWindow.addCls(this.activeWindowCls);
					activeWindow.removeCls(this.inactiveWindowCls);
					activeWindow.minimized = false;
					activeWindow.active = true;
				}

				this.taskbar.setActiveButton(activeWindow
						&& activeWindow.taskButton);
			},

			getStartConfig : function() {
				var me = this;
				var cfg = {
					app : me,
					menu : [],

					title : 'Don Griffin',
					iconCls : 'user',
					height : 300,
					width : 300
				};
				var launcher;

				Ext.each(me.modules, function(module) {

					launcher = module.launcher;

					if (launcher) {
						launcher.handler = launcher.handler
								|| Ext.bind(me.createW, me, [ module ]);

						cfg.menu.push(module.launcher);
					}
				});

				return cfg;
			},

			createW : function(module) {

				l(module);

				// new app.Win().show();

				var window = module.createWindow();
				window.show();

			},

			getModule : function(name) {
				var ms = this.modules;
				for (var i = 0, len = ms.length; i < len; i++) {
					var m = ms[i];
					if (m.id == name || m.appType == name) {
						return m;
					}
				}
				return null;
			},

			getDesktop : function() {
				return this;
			},

			getModules : function() {
				return [ //
				new app.Notepad(), //
				new app.TabWindow(),//
				// new app.MM() //
				];
			}

		});
