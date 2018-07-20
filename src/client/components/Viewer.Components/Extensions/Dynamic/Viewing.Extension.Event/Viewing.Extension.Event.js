const ExtensionId = 'Viewing.Extension.Event'

export default class EventExtension extends Autodesk.Viewing.Extension {

  constructor (viewer, options) {
    super()
    this.viewer = viewer
    this.options = options

  }

  load () {
    this.onSelectionBinded = this.onSelectionEvent.bind(this)
    this.onNavigationModeBinded = this.onNavigationModeEvent.bind(this)
    this.onModelBinded = this.onModelLoaded.bind(this)
    this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded)
    this.viewer.addEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, this.onNavigationModeBinded)
    this.viewer.addEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, this.onModelBinded)
    return true
  }

  unload () {
    this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded)
    this.viewer.removeEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, this.onNavigationModeBinded)
    this.viewer.removeEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, this.onModelBinded)
    this.onSelectionBinded = null
    this.onNavigationModeBinded = null
    this.onModelBinded = null
    return true
  }

  onSelectionEvent(event) {
    var currSelection = this.viewer.getSelection()
    // var domElem = document.getElementById('MySelectionValue')
    // domElem.innerText = currSelection.length

    // var AllDbIds = this.getAllDbIds(this.viewer);
    // this.viewer.model.getBulkProperties(AllDbIds, [
    //     'Keynote'
    //   ],
    //     function(elements){
    //     console.log(elements);//this includes all properties of a node.
    //   })
    // var items = [];
    this.viewer.model.getBulkProperties(currSelection, null, (elements) => {
      var items = elements.map( i => ({
        id: i.dbId,
        name: i.name,
        properties: {
          ...i.properties.reduce((obj, p) => {
            obj[p.displayName] = p.displayValue
            return obj
          }, {})
        }

      }))
      this.options.onDbItemSelected(items[0])
    })
  }

  getAllDbIds(viewer) {
    var instanceTree = viewer.model.getData().instanceTree;
    var allDbIdsStr = Object.keys(instanceTree.nodeAccess.dbIdToIndex);
    return allDbIdsStr.map(function(id) { return parseInt(id)});
  }

  onModelLoaded(event){
    console.log('Model has been loaded')
    console.log(this.options);
  }



  onNavigationModeEvent(event) {
    // var domElem = document.getElementById('MyToolValue')
    // domElem.innerText = event.id
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(ExtensionId, EventExtension)
