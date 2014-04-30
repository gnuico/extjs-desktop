/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

/**
 * @class Ext.ux.desktop.Desktop
 * @extends Ext.panel.Panel
 *          <p>
 *          This class manages the wallpaper, shortcuts and taskbar.
 *          </p>
 */

Ext
		.define(
				'desktop.Desktop',
				{
					extend : 'Ext.panel.Panel',

					activeWindowCls : 'ux-desktop-active-win',
					inactiveWindowCls : 'ux-desktop-inactive-win',
					lastActiveWindow : null,

					border : false,
					html : '&#160;',
					layout : 'fit',

					xTickSize : 1,
					yTickSize : 1,

					app : null,

					/**
					 * @cfg {Array|Store} shortcuts The items to add to the
					 *      DataView. This can be a {@link Ext.data.Store Store}
					 *      or a simple array. Items should minimally provide
					 *      the fields in the
					 *      {@link Ext.ux.desktop.ShorcutModel ShortcutModel}.
					 */
					shortcuts : null,

					/**
					 * @cfg {String} shortcutItemSelector This property is
					 *      passed to the DataView for the desktop to select
					 *      shortcut items. If the {@link #shortcutTpl} is
					 *      modified, this will probably need to be modified as
					 *      well.
					 */
					shortcutItemSelector : 'div.ux-desktop-shortcut',

					/**
					 * @cfg {String} shortcutTpl This XTemplate is used to
					 *      render items in the DataView. If this is changed,
					 *      the {@link shortcutItemSelect} will probably also
					 *      need to changed.
					 */
					shortcutTpl : [
							'<tpl for=".">',
							'<div class="ux-desktop-shortcut" id="{name}-shortcut">',
							'<div class="ux-desktop-shortcut-icon {iconCls}">',
							'<img src="',
							Ext.BLANK_IMAGE_URL,
							'" title="{name}">',
							'</div>',
							'<span class="ux-desktop-shortcut-text">{name}</span>',
							'</div>', '</tpl>', '<div class="x-clear"></div>' ],

					/**
					 * @cfg {Object} taskbarConfig The config object for the
					 *      TaskBar.
					 */
					taskbarConfig : null,

					windowMenu : null,

					lst_windows : Object,

					constructor : function() {

						this.lst_windows = new Ext.util.MixedCollection();

						this.callParent(arguments);
					},

					initComponent : function() {

						this.windowMenu = new Ext.menu.Menu(
								{
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
											items[0]
													.setDisabled(win.maximized !== true
															&& win.hidden !== true); // Restore
											items[1]
													.setDisabled(win.minimized === true); // Minimize
											items[2]
													.setDisabled(win.maximized === true
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

						this.taskbar = new desktop.TaskBar(this.taskbarConfig);
						this.taskbar.windowMenu = this.windowMenu;
						this.bbar = this.taskbar;

						this.contextMenu = new Ext.menu.Menu(this
								.createDesktopMenu());

						this.items = [ {
							xtype : 'wallpaper',
							id : this.id + '_wallpaper'
						}, this.createDataView() ];

						this.callParent();

						this.shortcutsView = this.items.getAt(1);

						this.shortcutsView.on('itemclick',
								this.onShortcutItemClick, this);

						var wallpaper = this.wallpaper;
						this.wallpaper = this.items.getAt(0);
						this.setWallpaper(wallpaper, this.wallpaperStretch);

					},

					afterRender : function() {

						this.callParent();
						this.el.on('contextmenu', this.onDesktopMenu, this);
					},

					// ------------------------------------------------------
					// Overrideable configuration creation methods

					createDataView : function() {

						return {
							xtype : 'dataview',
							overItemCls : 'x-view-over',
							trackOver : true,
							itemSelector : this.shortcutItemSelector,
							store : this.shortcuts,
							style : {
								position : 'absolute'
							},
							x : 0,
							y : 0,
							tpl : new Ext.XTemplate(this.shortcutTpl)
						};
					},

					createDesktopMenu : function() {
						var ret = {
							items : this.contextMenuItems || []
						};

						if (ret.items.length) {
							ret.items.push('-');
						}

						ret.items.push({
							text : 'Tile',
							handler : this.tileWindows,
							scope : this,
							minWindows : 1
						}, {
							text : 'Cascade',
							handler : this.cascadeWindows,
							scope : this,
							minWindows : 1
						})

						return ret;
					},

					// ------------------------------------------------------
					// Event handler methods

					onDesktopMenu : function(e) {
						var menu = this.contextMenu;
						e.stopEvent();
						if (!menu.rendered) {
							menu.on('beforeshow', this.onDesktopMenuBeforeShow,
									this);
						}
						menu.showAt(e.getXY());
						menu.doConstrain();
					},

					onDesktopMenuBeforeShow : function(menu) {
						var count = this.lst_windows.getCount();

						menu.items.each(function(item) {
							var min = item.minWindows || 0;
							item.setDisabled(count < min);
						});
					},

					onShortcutItemClick : function(dataView, record) {
						var module = this.app.getModule(record.data.module), win = module
								&& module.createWindow();

						if (win) {
							this.restoreWindow(win);
						}
					},

					onWindowClose : function(win) {

						this.lst_windows.remove(win);
						this.taskbar.removeTaskButton(win.taskButton);
						this.updateActiveWindow();
					},

					// ------------------------------------------------------
					// Window context menu handlers

					// ------------------------------------------------------
					// Dynamic (re)configuration methods

					getWallpaper : function() {
						return this.wallpaper.wallpaper;
					},

					setTickSize : function(xTickSize, yTickSize) {
						var xt = this.xTickSize = xTickSize, yt = this.yTickSize = (arguments.length > 1) ? yTickSize
								: xt;

						this.lst_windows.each(function(win) {
							var dd = win.dd, resizer = win.resizer;
							dd.xTickSize = xt;
							dd.yTickSize = yt;
							resizer.widthIncrement = xt;
							resizer.heightIncrement = yt;
						});
					},

					setWallpaper : function(wallpaper, stretch) {
						this.wallpaper.setWallpaper(wallpaper, stretch);
						return this;
					},

					// ------------------------------------------------------
					// Window management methods

					cascadeWindows : function() {
						var x = 0, y = 0, zmgr = this.getDesktopZIndexManager();

						zmgr.eachBottomUp(function(win) {
							if (win.isWindow && win.isVisible()
									&& !win.maximized) {
								win.setPosition(x, y);
								x += 20;
								y += 20;
							}
						});
					},

					createWindow : function(config, cls) {
						var win;
						var cfg = Ext.applyIf(config || {}, {
							stateful : false,
							isWindow : true,
							constrainHeader : true,
							minimizable : true,
							maximizable : true
						});

						cls = cls || Ext.window.Window;
						win = this.add(new cls(cfg));

						this.lst_windows.add(win);

						win.taskButton = this.taskbar.addTaskButton(win);
						win.animateTarget = win.taskButton.el;

						win.on({
							activate : this.updateActiveWindow,
							beforeshow : this.updateActiveWindow,
							deactivate : this.updateActiveWindow,
							minimize : this.minimizeWindow,
							destroy : this.onWindowClose,
							scope : this
						});

						win
								.on({
									boxready : function() {
										win.dd.xTickSize = this.xTickSize;
										win.dd.yTickSize = this.yTickSize;

										if (win.resizer) {
											win.resizer.widthIncrement = this.xTickSize;
											win.resizer.heightIncrement = this.yTickSize;
										}
									},
									single : true
								});

						
						win.doClose = function() {
							win.doClose = Ext.emptyFn; // dblclick can call
							// again...
							win.el.disableShadow();
							win.el.fadeOut({
								listeners : {
									afteranimate : function() {
										win.destroy();
									}
								}
							});
						};

						return win;
					},

					getActiveWindow : function() {
						var win = null, zmgr = this.getDesktopZIndexManager();

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

						return win;
					},

					getDesktopZIndexManager : function() {

						// TODO - there has to be a better way to get this...
						return (this.lst_windows.getCount() && this.lst_windows
								.getAt(0).zIndexManager)
								|| null;
					},

					getWindow : function(id) {
						return this.lst_windows.get(id);
					},

					minimizeWindow : function(win) {
						win.minimized = true;
						win.hide();
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

					tileWindows : function() {
						var availWidth = this.body.getWidth(true);
						var x = this.xTickSize, y = this.yTickSize, nextY = y;

						this.lst_windows.each(function(win) {
							if (win.isVisible() && !win.maximized) {
								var w = win.el.getWidth();

								// Wrap to next row if we are not at the line
								// start and this Window will
								// go off the end
								if (x > this.xTickSize && x + w > availWidth) {
									x = this.xTickSize;
									y = nextY;
								}

								win.setPosition(x, y);
								x += w + this.xTickSize;
								nextY = Math.max(nextY, y + win.el.getHeight()
										+ this.yTickSize);
							}
						});
					},

					updateActiveWindow : function() {
						var activeWindow = this.getActiveWindow(), last = this.lastActiveWindow;
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
					}
				});
