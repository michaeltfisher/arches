define([
  'knockout',
  'underscore',
  'viewmodels/widget',
  'arches',
  'map/mapbox-style',
  'bindings/fadeVisible',
  'bindings/mapbox-gl',
  'bindings/chosen'
], function (ko, _, WidgetViewModel, arches, mapStyle) {
    /**
    * knockout components namespace used in arches
    * @external "ko.components"
    * @see http://knockoutjs.com/documentation/component-binding.html
    */

    /**
    * registers a geometry-widget component for use in forms
    * @function external:"ko.components".geometry-widget
    * @param {object} params
    * @param {boolean} params.value - the value being managed
    * @param {object} params.config -
    * @param {string} params.config.zoom - map zoom level
    * @param {string} params.config.centerX - map center longitude
    * @param {string} params.config.centerY - map center latitude
    * @param {string} params.config.geocoder - the text string id of the geocoder api (currently MapzenGeocoder or BingGeocoder).
    * @param {string} params.config.basemap - the layer name of the selected basemap to be shown in the map
    * @param {string} params.config.geometryTypes - the geometry types available for a user to edit
    * @param {string} params.config.pitch - the pitch of the map in degrees
    * @param {string} params.config.pitch - the bearing of the map in degrees with north at 0
    */
    return ko.components.register('geometry-widget', {
        viewModel: function(params) {

            var self = this;
            params.configKeys = ['zoom', 'centerX', 'centerY', 'geocoder', 'basemap', 'geometryTypes', 'pitch', 'bearing'];
            WidgetViewModel.apply(this, [params]);
            this.selectedBasemap = this.basemap;

            this.mapToolsExpanded = ko.observable(false);
            this.geocodeShimAdded = ko.observable(false);
            this.mapToolsExpanded.subscribe(function (expanded) {
               self.geocodeShimAdded(expanded);
            });

            this.mapControlPanels = {
              basemaps: ko.observable(false),
              overlays: ko.observable(true),
              maptools: ko.observable(true),
              legend: ko.observable(true)
            };

            this.geocoderOptions = ko.observableArray([{'id':'MapzenGeocoder','name':'Mapzen'},{'id':'BingGeocoder','name':'Bing'}]);

            this.onGeocodeSelection = function(val, e) {
              this.geocoder(e.currentTarget.value)
            }

            this.toggleMapTools = function(data, event){
                data.mapToolsExpanded(!data.mapToolsExpanded());
            }

            this.toggleMapControlPanels = function(data, event){
                var panel = data;
                _.each(self.mapControlPanels, function(panelValue, panelName) {
                    panelName === panel ? panelValue(false) : panelValue(true);
                  }
                  );
            }

            this.mapOptions = {
                style: mapStyle
            };


            this.selectBasemap = function(val){
              self.basemap(val.name)
              self.setBasemap(val);
            }

            this.setupMap = function(map) {
                console.log(map)
            }
        },
        template: { require: 'text!widget-templates/geometry' }
    });
});
