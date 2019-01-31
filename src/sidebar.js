L.Control.Sidebar = L.Control.extend({
	options: {
		position: 'topleft',
		openOnAdd: false,
		showHeader: false,
		showFooter: false,
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
		
		// Determines the height of the sidebar body based on options passed by user
		var bodyHeight = 76 + (this.options.showHeader ? 0 : 10) + (this.options.showFooter ? 0 : 10);

		// Extracts the different layers for this sidebar
		this._layers = [];
		for(var i = 0; i < this._sidebar.children.length; i++)
		{
			var newLayer = this._sidebar.children[i];
			
			L.DomUtil.addClass(newLayer.children[0], this._side + '-header');			
			L.DomUtil.addClass(newLayer.children[1], this._side + '-body');
			L.DomUtil.addClass(newLayer.children[2], this._side + '-footer');

			// Modifies height of the elements based on options
			if(!this.options.showHeader)
			{
				newLayer.children[0].style.height = '0vh';
			}

			if(!this.options.showFooter)
			{
				newLayer.children[2].style.height = '0vh';
			}
			
			newLayer.children[1].style.height = bodyHeight.toString() + 'vh';
			
			this._layers.push(newLayer.innerHTML);
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

		// Creates the div for the sidebar
		this._content = L.DomUtil.create('div', 'sample');
		this._content.innerHTML = this._layers[0];
		this._content.style = (this._isVisible) ? "display: block;" : "display: none;";
				
		// Creates the div for the button to toggle the sidebar
		this._closeButton = L.DomUtil.create('div', 'sidebar-close');
		L.DomUtil.addClass(this._closeButton, this._side + '-close');
		
		// An XNOR of if the side is left and if it is visible to determine correct arrow
		var value = (!(this._side === 'left' ^ this._isVisible)) ? '<' : '>';
		this._closeButton.innerHTML = "<input type='button' class='close-button' value='" + value + "' onclick='toggleSidebar(\"" + this._id + "\");'></input>";
		
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
		// Fills in sidebar container with the content and button
		this._container.style = "display: block;";

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
			toggleSidebar(this._id);
		}
	},
	close: function() 
	{
		// If the sidebar is currently marked as visible, close it
		if(this._isVisible) 
		{
			this._isVisible = false;
			toggleSidebar(this._id);
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
			this._content.removeChild(this._content.firstChild);
		}
		
		// Sets the sidebar content to the requested layer
		// BUG: Changing the innerHTML may not be best practice, but I couldn't get appendChild to work for me
		this._content.innerHTML = this._layers[index];
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

function toggleSidebar(sidebarID)
{
	// Gets sidebar container by the ID
	var sidebar = document.getElementById(sidebarID);
	
	var closeButton, sidebarContent;
	
	if(L.DomUtil.hasClass(sidebar.children[0], 'sidebar-close'))
	{
		closeButton = sidebar.children[0];
		sidebarContent = sidebar.children[1];
	}
	else
	{
		closeButton = sidebar.children[1];
		sidebarContent = sidebar.children[0];
	}

	// Changes the text on the close button
	closeButton.children[0].value = (closeButton.children[0].value === '<' ? '>' : '<');
	
	// Toggles class 'right-closed' for right-oriented close button
	if(L.DomUtil.hasClass(closeButton, 'right-close'))
	{
		if(L.DomUtil.hasClass(closeButton, 'right-closed'))
		{
			L.DomUtil.removeClass(closeButton, 'right-closed');
		}
		else
		{
			L.DomUtil.addClass(closeButton, 'right-closed');
		}
	}

	// Toggles sidebar content
	if(sidebarContent.style.display === 'none')
	{
		sidebarContent.style.display = 'block';
	}
	else
	{
		sidebarContent.style.display = 'none';
	}
}

L.control.sidebar = function(sidebarID, options) {
	return new L.Control.Sidebar(sidebarID, options);
};