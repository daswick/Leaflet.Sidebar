# Leaflet.Sidebar
A sidebar for Leaflet with ease of use in mind.

## Usage
This control was designed using Leaflet v1.4.0, but works as far back as v0.7.2 (at least that's as far as I've tested). This has no other dependencies. The sidebar includes two required files, [sidebar.js](https://github.com/daswick/Leaflet.Sidebar/blob/master/src/sidebar.js) and [sidebar.css](https://github.com/daswick/Leaflet.Sidebar/blob/master/src/sidebar.css), as well as an optional file, [sidebar-fancy.css](https://github.com/daswick/Leaflet.Sidebar/blob/master/src/sidebar-fancy.css), with additional styles and transitions.

Before you create the sidebar, have a block in the HTML that the sidebar can pull. Inside the div should be a number of divs with the class "sidebar-source". These will be hidden from page load and will act as the layer containers. The suggested format is this:

```html
<div id="sidebar" class="sidebar">
  <div class="sidebar-source">
    <div class="sidebar-header"> Header 1 content </div>
    <div class="sidebar-content"> Body 1 content </div>
    <div class="sidebar-footer"> Footer 1 content </div>
  </div>
  <div class="sidebar-source">
    <div class="sidebar-header"> Header 2 content </div>
    <div class="sidebar-content"> Body 2 content </div>
    <div class="sidebar-footer"> Footer 2 content </div>
  </div>	
</div>
```

You can also specify a "parent" attribute for a layer. This will be read in the code and add a "back button" of sorts to that layer that returns to the specified parent. For example, taking the example above, the first instance of "sidebar-source" would be layer 0 and the second being layer 1. If I took the second and changed it to the following, layer 1 would generate a button that returns the sidebar to layer 0.

```html
<div class="sidebar-source" parent="0">
```

To create the sidebar, call the control with the ID of the HTML element that contains all of the desired sidebar layers. The above example could use the following:

```javascript
var sidebar = L.control.sidebar("sidebar", options).addTo(map);
```

## Options
| Property | Type | Default | Description |
| --- | --- | --- | --- |
| position | String | 'topleft' | The position of the sidebar. 'topleft' and 'bottomleft' map to the left side and 'topright' and 'bottomright' map to the right side. |
| openOnAdd | Boolean | false | Determines if the sidebar is open/closed when added to the map. |
| showHeader | Boolean | false | Determines if the sidebar should display the header section. |
| showFooter | Boolean | false | Determines if the sidebar should display the footer section. |
| fullHeight | Boolean | false | Allows the sidebar to take up the full height of the window rather than having margins on the side. |
| togglePan | Boolean | false | Pans the map right/left when the sidebar opens/closes respectively. |
| headerHeight | Number | 10 | Specifies the height of the header (units in 'vh'). |
| footerHeight | Number | 10 | Specifies the height of the footer (units in 'vh'). |

## Methods
| Method | Returns | Description |
| --- | --- | --- |
| open() | N/A | Opens the sidebar. |
| close() | N/A | Closes the sidebar. |
| showParent() | N/A | If the current layer has a specified parent, display the parent layer. |
| showLayer(\<Number> index) | N/A | If the index is within bounds, display the index<sup>th</sup> layer. |
| toggle() | N/A | Toggles the sidebar. |
| getContainer() | HTMLElement | Returns the HTML element that contains the sidebar. |
| getCurrentIndex() | Number | Returns the index of the current layer of the sidebar. |
| getCloseButton() | HTMLElement | Returns the HTML element that contains the close button. |

## Examples

A basic example showing off some of the options, the body scroll, switching between layers, and the parent attribute.

[Basic example demo page](https://daswick.github.io/Leaflet.Sidebar/examples/demo.html) - [demo.html](https://github.com/daswick/Leaflet.Sidebar/blob/master/examples/demo.html) and [demo.css](https://github.com/daswick/Leaflet.Sidebar/blob/master/examples/demo.css)

Another example that shows the possibility of two independent sidebars, each with two layers and a parent attribute.

[Two sidebars demo page](https://daswick.github.io/Leaflet.Sidebar/examples/two-sidebars.html) - [two-sidebars.html](https://github.com/daswick/Leaflet.Sidebar/blob/master/examples/two-sidebars.html) and [two-sidebars.css](https://github.com/daswick/Leaflet.Sidebar/blob/master/examples/two-sidebars.css)

## License
Leaflet.Sidebar is free software and may be redistributed under the MIT license.
