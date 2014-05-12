Ext.define('desktop.StartMenu', {
	extend : 'Ext.panel.Panel',

	xtype : 'startmenu',

	ariaRole : 'menu',

	cls : 'x-menu ux-start-menu',
	defaultAlign : 'bl-tl',
	iconCls : 'user',
	floating : true,
	shadow : true,
	width : 300,

	initComponent : function() {
		var me = this;
		var menu = me.menu;

		me.menu = new Ext.menu.Menu({
			cls : 'ux-start-menu-body',
			border : false,
			floating : false,
			items : menu
		});
		me.menu.layout.align = 'stretch';

		me.items = [ me.menu ];
		me.layout = 'fit';

		Ext.menu.Manager.register(me);
		me.callParent();

		me.toolbar = new Ext.toolbar.Toolbar(Ext.apply({
			dock : 'right',
			cls : 'ux-start-menu-toolbar',
			vertical : true,
			width : 100,
			listeners : {
				add : function(tb, c) {
					c.on({
						click : function() {
							me.hide();
						}
					});
				}
			}
		}, me.toolConfig));

		me.toolbar.layout.align = 'stretch';
		me.addDocked(me.toolbar);

		delete me.toolItems;
	},

	addMenuItem : function() {
		var cmp = this.menu;
		cmp.add.apply(cmp, arguments);
	},

	addToolItem : function() {
		var cmp = this.toolbar;
		cmp.add.apply(cmp, arguments);
	}
});
