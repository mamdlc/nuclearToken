function ObjectCodePanel(viewer, container, id, title, options) {
    this.viewer = viewer;
    Autodesk.Viewing.UI.PropertyPanel.call(this, container, id, title, options);
}
ObjectCodePanel.prototype = Object.create(Autodesk.Viewing.UI.PropertyPanel.prototype);
ObjectCodePanel.prototype.constructor = ObjectCodePanel;

// *******************************************
// Object Code extension
// *******************************************
function ObjectCodeExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.viewer = viewer;
    this.options = options;
    this.toolbarButtonShowDockingPanel = null;
    this.panel = null;
}

ObjectCodeExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
ObjectCodeExtension.prototype.constructor = ObjectCodeExtension;

ObjectCodeExtension.prototype.load = function () {
    console.log('QS Panel has been loaded');
        
    
    var _this = this;
    this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function (e) {
        // debugger
        if (e.dbIdArray.length == 0) {
            _this.subToolbar.setVisible(false);
            if (_this.panel) _this.panel.setVisible(false);
            return;
        }
        _this.viewer.model.getBulkProperties(e.dbIdArray, ['_EDT_QSID', 'name'], function (elements) {
            
            _this.subToolbar.setVisible((elements.length > 0));
            if (_this.panel) _this.panel.removeAllProperties();
            if (_this.panel && elements.length > 0) _this.loadObjectCode(elements);
            
        })
    })


    // if (this.viewer.toolbar) {
    //     // Toolbar is already available, create the UI
    //     this.createUI();
    // } else {
    //     // Toolbar hasn't been created yet, wait until we get notification of its creation
    //     this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
    //     this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    // }
    return true;
}

ObjectCodeExtension.prototype.loadObjectCode = function (elements) {
    var _this = this;
    _this.panel.removeAllProperties();
    elements.forEach(function (element) {
        var conexion = 'http://10.5.8.160:8080/alldata/' + element.properties[0].displayValue;
        fetch(conexion)
            .then((response) => response.json())
            .then(function (data) {
                _this.panel.addProperty('Code', data[0].qsid, element.name);
                _this.panel.addProperty('UoM', data[0].uom, element.name);
                _this.panel.addProperty('Description', data[0].description, element.name);
                _this.panel.addProperty('Technical Specification', data[0].technical_spec, element.name);
                _this.panel.addProperty('Section', data[0].Section, element.name);
                _this.panel.addProperty('Fixed Furnitures & Equipments', data[0].ff_e_extras, element.name);
                _this.panel.addProperty('CBS', data[0]["CBS (NRM1)"], element.name);
            })
            .catch(function (error) {
                console.log(error);
            });
    })

}



ObjectCodeExtension.prototype.onToolbarCreated = function () {
    this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
}



ObjectCodeExtension.prototype.createUI = function () {
    var _this = this;
    // need to create the panel for later use
    if (_this.panel == null) {
        _this.panel = new ObjectCodePanel(_this.viewer, _this.viewer.container,
            'objectCodePanel', 'QSID Panel');
    }

    // button to show the docking panel
    var toolbarButtonShowDockingPanel = new Autodesk.Viewing.UI.Button('showObjectCodePanel');
    toolbarButtonShowDockingPanel.onClick = function (e) {
        // show/hide docking panel
        _this.panel.setVisible(!_this.panel.isVisible());
    };

    toolbarButtonShowDockingPanel.addClass('ObjectCodeToolbarButton');
    toolbarButtonShowDockingPanel.setToolTip('QSID Panel');

    // SubToolbar
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('ObjectCodeToolbar');
    this.subToolbar.addControl(toolbarButtonShowDockingPanel);

    this.viewer.toolbar.addControl(this.subToolbar);
    this.subToolbar.setVisible(false);
}
ObjectCodeExtension.prototype.unload = function () {
    this.viewer.toolbar.removeControl(this.subToolbar);
    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('ObjectCodeExtension-090620', ObjectCodeExtension);