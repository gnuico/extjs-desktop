
Ext.require([//
'app.App',//	
'app.Notepad',//
'app.TabWindow',//
'app.Win'
]);//

l = function(str){console.log(str);};

Ext.onReady(function() {
	//Ext.create('app.App');
	new app.App();	
	//new app.Win().show();
});




