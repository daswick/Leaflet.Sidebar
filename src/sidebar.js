L.Control.Sidebar = L.Control.extend({
	options: {
		position: 'topleft',
	},
	initialize: function(options) 
	{
		// Sets options of leaflet object
		L.setOptions(this, options);
		
		this._isVisible = false;
		
		// Returns element from HTML based on its ID
		this._sidebar = L.DomUtil.get('sidebar');
		
		L.DomUtil.addClass(this._sidebar, 'sidebar-left');
		
		if(L.Browser.touch) {
			L.DomUtil.addClass(this._sidebar, 'leaflet-touch');
		}
				
		// Gets content for sidebar
		this._content = this._sidebar.children[0];
	},
	onAdd: function() {		
		var div = L.DomUtil.create('div', 'command');
		div.innerHTML = this._content.innerHTML;
		div.id = "sidebar-interact";
		div.style = "display: none;";
		return div;
	},
	open: function() {
		if(!this._isVisible) {
			this._isVisible = true;
			L.DomUtil.get("sidebar-interact").style = "display: block;";
		}
	},
	close: function() {
		if(this._isVisible) {
			this._isVisible = false;
			L.DomUtil.get("sidebar-interact").style = "display: none;";
		}
	},
	toggle: function() {
		if(this._isVisible)
			this.close();
		else
			this.open();
	}
	/* 
		Possible functions:
		setOptions
		onRemove
		setWidth
		setContent
	*/
});

L.control.sidebar = function(options) {
	return new L.Control.Sidebar(options);
};