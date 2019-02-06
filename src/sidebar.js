L.Control.Sidebar = L.Control.extend({
	options: {
		position: 'topleft',
		openOnAdd: false,
		showHeader: false,
		showFooter: false,
		fullHeight: false,
		headerHeight: 10,
		footerHeight: 10
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
		
		// Gets the "side" of the map the sidebar is on
		this._side = (this.options.position === 'topright' || this.options.position === 'bottomright') ? 'right' : 'left';
		this._id = (this.options.position === 'topright' || this.options.position === 'bottomright') ? "sidebar-right" : "sidebar-left";
		
		// Determines the height of the sidebar elements based on options passed by user
		var headerHeight = this.options.showHeader ? this.options.headerHeight : 0;
		var footerHeight = this.options.showFooter ? this.options.footerHeight : 0;
		var bodyHeight = (this.options.fullHeight ? 100 : 97) - headerHeight - footerHeight;

		// Extracts the different layers for this sidebar
		this._layers = [];
		for(var i = 0; i < this._sidebar.children.length; i++)
		{
			var newLayer = this._sidebar.children[i];
			
			// Assigns classes to header, body, and footer nodes
			L.DomUtil.addClass(newLayer.children[0], this._side + '-header');			
			L.DomUtil.addClass(newLayer.children[1], this._side + '-body');
			L.DomUtil.addClass(newLayer.children[2], this._side + '-footer');

			// Modifies height of the elements based on options
			newLayer.children[0].style.height = this.options.showHeader ? this.options.headerHeight.toString() + 'vh' : '0vh';
			newLayer.children[1].style.height = bodyHeight.toString() + 'vh';
			newLayer.children[2].style.height = this.options.showFooter ? this.options.footerHeight.toString() + 'vh' : '0vh';
			
			// Adds in "back" button if the layer has a parent set
			if(newLayer.getAttribute("parent"))
			{
				// Shrink body height to accommodate back button
				newLayer.children[1].style.height = (bodyHeight - 3).toString() + 'vh';
				
				// Parses parent attribute and creates back button container div
				var layerParent = parseInt(newLayer.getAttribute("parent"));
				var backDiv = L.DomUtil.create('div', 'sidebar-back');
				
				// Creates actual button with the back function
				var backButton = L.DomUtil.create('button', 'back-button');
				backButton.innerHTML = "Back";
				L.DomEvent.on(backButton, 'click', function() { 
					this.showLayer(layerParent); 
				}, this);
				backDiv.appendChild(backButton);
				
				// Inserts back button before body section
				newLayer.insertBefore(backDiv, newLayer.children[1]);
			}
			
			this._layers.push(newLayer);
		}
	},
	onAdd: function(map) 
	{
		// Moves Leaflet attribution to bottomleft if sidebar is set for right
		// BUG: If this is removed and sidebar is set for bottomright, the sidebar will appear incorrectly
		if(this._side === 'right')
		{
			if(map.attributionControl)
			{
				map.attributionControl.setPosition('bottomleft');
			}
		}
		
		// Allows the user to specify if the sidebar is open when added to map
		this._isVisible = this.options.openOnAdd;

		// Creates the container for the sidebar and the button
		this._container = L.DomUtil.create('div', 'leaflet-sidebar');
		this._container.id = this._id;

		// Disables margins if the user has specified full height
		if(this.options.fullHeight)
		{
			this._container.style.marginTop = 0;
			this._container.style.marginRight = 0;
			this._container.style.marginLeft = 0;
		}
		
		// Ensures the toggle button will go to the end of the page
		if(this._side === 'right')
		{
			this._container.style.justifyContent = 'flex-end';
		}

		// Creates the div for the sidebar
		this._content = L.DomUtil.create('div', 'sidebar-layer');
		this._content.id = this._side + "-layer";
		
		// Adds classes to left sidebar (for the slide-in animation)
		if(this._side === 'left') 
		{
			this._content.classList.add(this._side + '-collapse');
			this._content.classList.add(this._side + '-show');
		}
		
		// Adds classes to right sidebar (for the slide-in animation)
		if(this._side === 'right') 
		{
			this._content.classList.add(this._side + '-collapse');
			this._content.classList.add(this._side + '-show');
		}
		
		// Extracts nodes from first layer to place into sidebar
		this._currentIndex = 0;
		while(this._layers[0].firstChild)
		{
			this._content.appendChild(this._layers[0].firstChild);
		}
		
		// Creates the div for the button to toggle the sidebar
		this._closeButton = L.DomUtil.create('div', 'sidebar-close');
		L.DomUtil.addClass(this._closeButton, this._side + '-close');
		
		// Creates the actual button to toggle the sidebar
		var cButton = L.DomUtil.create('button', 'close-button');
		cButton.innerHTML = (!(this._side === 'left' ^ this._isVisible)) ? /* < */ '&#128896;' : '&#128898;' /* > */;
		L.DomEvent.on(cButton, 'click', function() {
			this.toggle();
		}, this);
		this._closeButton.appendChild(cButton);
		
		// Changes order of additions based on side (so they display correctly)
		if(this._side === 'right')
		{
			this._container.appendChild(this._closeButton);	
			this._container.appendChild(this._content);
		}
		else
		{
			this._container.appendChild(this._content);
			this._container.appendChild(this._closeButton);		
		}

		// Disables click and scroll propagation, i.e. allow user to click and scroll on sidebar without affecting map
		L.DomEvent.on(this._container, 'mousewheel', L.DomEvent.stopPropagation);
		L.DomEvent.disableClickPropagation(this._container);		

		return this._container;
	},
	open: function() 
	{
		// If the sidebar is not currently marked as visible, open up
		if(!this._isVisible) 
		{
			this._isVisible = true;
			
			this._closeButton.firstChild.innerHTML = (this._side === 'right') ? /* > */ '&#128898;' : '&#128896;' /* < */;
			if (this._side === 'left') 
			{
				this._content.classList.add(this._side + '-show');
			}
			
			if (this._side === 'right') 
			{	
				this._content.classList.add(this._side + '-show');
			}

		}
	},
	close: function() 
	{
		// If the sidebar is currently marked as visible, close it
		if(this._isVisible) 
		{
			this._isVisible = false;

			this._closeButton.firstChild.innerHTML = (this._side === 'right') ? /* < */ '&#128896;' : '&#128898;' /* > */;

			if (this._side === 'left') 
			{	
				this._content.classList.remove(this._side + '-show');
			}
			
			if (this._side === 'right') 
			{	
				this._content.classList.remove(this._side + '-show');
			}
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
		while(this._content.firstChild)
		{
			this._layers[this._currentIndex].appendChild(this._content.firstChild);
		}
		
		// Sets the sidebar content to the requested layer
		while(this._layers[index].firstChild)
		{
			this._content.appendChild(this._layers[index].firstChild);
		}
		this._currentIndex = index;
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