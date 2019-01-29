L.Control.Sidebar = L.Control.extend({
	options: {
		position: 'topleft',
		openOnAdd: false,
	},
	initialize: function(sidebarID, options) 
	{
		// Sets options of leaflet object
		L.setOptions(this, options);
		
		// Returns element from HTML based on its ID
		this._sidebar = L.DomUtil.get(sidebarID);
		
		// This helps if the user is on mobile?
		if(L.Browser.touch) 
		{
			L.DomUtil.addClass(this._sidebar, 'leaflet-touch');
		}
		
		// Extracts the different layers for this sidebar
		this._layers = [];
		for(var i = 0; i < this._sidebar.children.length; i++)
		{
			this._layers.push(this._sidebar.children[i].innerHTML);
		}
	},
	onAdd: function(map) 
	{
		// Moves Leaflet attribution to bottomleft if sidebar is set for right
		// BUG: If this is removed and sidebar is set for bottomright, the sidebar will appear incorrectly
		if(this.options.position === 'topright' || this.options.position === 'bottomright')
		{
			if(map.attributionControl)
			{
				map.attributionControl.setPosition('bottomleft');
			}
		}
		
		// Creates the div of class leaflet-sidebar and set its content and ID
		this._container = L.DomUtil.create('div', 'leaflet-sidebar');
		this._container.innerHTML = this._layers[0];
		this._container.id = (this.options.position === 'topright' || this.options.position === 'bottomright') ? "sidebar-right" : "sidebar-left";

		// Disables click and scroll propagation, i.e. allow user to click and scroll on sidebar without affecting map
		L.DomEvent.on(this._container, 'mousewheel', L.DomEvent.stopPropagation);
		L.DomEvent.disableClickPropagation(this._container);
		
		// Allows the user to specify if the sidebar is open when added to map
		this._isVisible = this.options.openOnAdd;

		if(this._isVisible)
		{
			this._container.style = "display: block;";
		}
		else
		{
			this._container.style = "display: none;";
		}
		
		return this._container;
	},
	open: function() 
	{
		// If the sidebar is not currently marked as visible, open up
		if(!this._isVisible) 
		{
			this._isVisible = true;
			this._container.style = "display: block;";
		}
	},
	close: function() 
	{
		// If the sidebar is currently marked as visible, close it
		if(this._isVisible) 
		{
			this._isVisible = false;
			this._container.style = "display: block;";
		}
	},
	showLayer: function(index) 
	{
		// Ensures that the index passed is not out of bounds
		if(index > this._layers.length)
		{
			return;
		}
		
		// Removes all content from the sidebar (and removes any nodes)
		while(this._container.firstChild)
		{
			this._container.removeChild(this._container.firstChild);
		}
		
		// Sets the sidebar content to the requested layer
		// BUG: Changing the innerHTML may not be best practice, but I couldn't get appendChild to work for me
		this._container.innerHTML = this._layers[index];
	},
	toggle: function() 
	{
		// If the sidebar is currently marked as visible, close it. Otherwise, open it.
		if(this._isVisible)
		{
			this.close();
		}
		else
		{
			this.open();
		}
	}
	/* 
		Possible functions:
		setOptions
		onRemove
		setWidth
		setContent
	*/
});

L.control.sidebar = function(sidebarID, options) {
	return new L.Control.Sidebar(sidebarID, options);
};