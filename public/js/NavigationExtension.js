class NavigationExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._panel = null;
        this._data = null;
    }
    
    load() {
        fetch('http://localhost:3000/alldataview')
        .then(resp => resp.json())
        .then(json => { this._data = json; this.populateNavigationPanel(); });
        this._panel = new NavigationPanel(this.viewer, this.viewer.container, 'navigationPanel', 'Navigation Panel');
	    console.log('NavigationExtension loaded.');
        return true;   
    }
    unload() {
        console.log('NavigationExtension unloaded.');
        return true;
        
    }
    onToolbarCreated() {
        this.toolbarGroup = this.viewer.toolbar.getControl('toolbarGroup');
        if (!this.toolbarGroup) {
            this.toolbarGroup = new Autodesk.Viewing.UI.ControlGroup('toolbarGroup');
            this.viewer.toolbar.addControl(this.toolbarGroup)
        }
        this.toolbarButton = new Autodesk.Viewing.UI.Button('navigationButton');
        this.toolbarButton.onClick = async (ev) => 
        {
        this._panel.setVisible(!this._panel.isVisible());
        };
        this.toolbarButton.setToolTip('Navigation');
        this.toolbarButton.addClass('navigationButtonIcon');
        this.toolbarGroup.addControl(this.toolbarButton)
    }
        
        async populateNavigationPanel() {
        this._panel.removeAllProperties();
		for (const item of this._data) {
			this._panel.addProperty(item['qsid'],item['NRM2-Headings'],'PARTIDAS');
		}
    }
}
class NavigationPanel extends Autodesk.Viewing.UI.PropertyPanel {
    constructor(viewer, container, id, title, options) {
        super(container, id, title, options);
        this.viewer = viewer;
    }

    onPropertyClick(property, event) {
        console.log(property.name + " = " + property.value)
        this.viewer.search('"' + property.value + '"', function(dbIds) {
            console.log(dbIds.length);
            getSubset(dbIds, property.name, property.value, function(dbIds) {
                this.viewer.isolate(dbIds)
            })
        }, function(error) {}, [property.attributeName])
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('NavigationExtension-MAM', NavigationExtension);


