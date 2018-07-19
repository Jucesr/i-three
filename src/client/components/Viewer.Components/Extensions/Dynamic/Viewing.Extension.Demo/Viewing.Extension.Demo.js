const ExtensionId = 'Viewing.Extension.Demo'

export default class DemoExtension extends Autodesk.Viewing.Extension {

  constructor (viewer, options) {
    super()
    this.viewer = viewer
  }

  load () {
    this.viewer.setBackgroundColor(0, 255, 0, 0, 0, 0)
    console.log (`${ExtensionId} loaded`)
    return true
  }

  unload () {
    console.log (`${ExtensionId} unloaded`)
    return true
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(ExtensionId, DemoExtension)
