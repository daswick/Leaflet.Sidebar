L.Control.Sidebar = L.Control.extend({
	options: {
		position: 'topleft',
		openOnAdd: false,
	},
	initialize: function(options) 
	{
		// Sets options of leaflet object
		L.setOptions(this, options);
		
		// Returns element from HTML based on its ID
		this._sidebar = L.DomUtil.get('sidebar');
		
		if(L.Browser.touch) 
		{
			L.DomUtil.addClass(this._sidebar, 'leaflet-touch');
		}
		
		this._layers = [];
		for(var i = 0; i < this._sidebar.children.length; i++)
		{
			this._layers.push(this._sidebar.children[i].innerHTML);
		}
	},
	onAdd: function(map) 
	{
		if(this.options.position === 'topright' || this.options.position === 'bottomright')
		{
			if(map.attributionControl)
			{
				map.attributionControl.setPosition('bottomleft');
			}
		}
		
		this._container = L.DomUtil.create('div', 'leaflet-control');
		this._container.innerHTML = this._layers[0];
		this._container.id = "sidebar-interact";
		
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
		if(!this._isVisible) 
		{
			this._isVisible = true;
			L.DomUtil.get("sidebar-interact").style = "display: block;";
		}
	},
	close: function() 
	{
		if(this._isVisible) 
		{
			this._isVisible = false;
			L.DomUtil.get("sidebar-interact").style = "display: none;";
		}
	},
	showLayer: function(index) 
	{
		if(index > this._layers.length)
		{
			return;
		}
			
		while(this._container.firstChild)
		{
			this._container.removeChild(this._container.firstChild);
		}
		
		this._container.innerHTML = this._layers[index];
				
		this._openLayer = index;
	},
	toggle: function() 
	{
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

L.control.sidebar = function(options) {
	return new L.Control.Sidebar(options);
};