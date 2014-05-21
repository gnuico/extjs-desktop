Ext.define('system.taskbar.StartMenu', {
	extend : 'Ext.panel.Panel',

	xtype : 'startmenu',
	cls : 'x-menu ux-start-menu',
	defaultAlign : 'bl-tl',

	floating : true,
	shadow : true,
	

	initComponent : function() {

		var me = this;
		

		var menu = new Ext.menu.Menu({
			cls : 'ux-start-menu-body',
			border : false,
			floating : false,
			items : this.menu
		});
		

		this.items = [ menu ];

		Ext.menu.Manager.register(this);
		this.callParent();

		this.toolbar = new Ext.toolbar.Toolbar(Ext.apply({
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
		}, this.toolConfig));

		this.toolbar.layout.align = 'stretch';
		this.addDocked(this.toolbar);

	}
});
