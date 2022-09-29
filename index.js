const path = require("path")
const {ipcMain} = require("electron")
const writeFileSync = require('fs').writeFileSync;
const mkdirSync = require('fs').mkdirSync;

module.exports = class TaskprogMain {
    constructor(env) {
        // Define plugin enviornment within the class
        this.env = env
        this.playing = null;
    }

    // Called when the backend is ready
    onReady(win) {
        if (!existsSync(`${this.env.dir}/dist`)) {
            mkdirSync(`${this.env.dir}/dist`);
        }
        ipcMain.on('wsapi-updatePlaybackState', (event, attributes) => {
            try {
                writeFileSync(`${this.env.dir}/dist/data.txt`, JSON.stringify(attributes))
            } catch(e) {
                console.log("[Plugin][AaroProg][Error]",e)
            }
        })

        console.log("[Plugin][AaroProg] Taskprog Backend Ready.")
    }

    // Called when the renderer is ready (app.init())
    onRendererReady(win) {
        console.debug("Renderer Ready Called")
        // Load the frontend plugin
        this.env.utils.loadJSFrontend(path.join(this.env.dir, "index.frontend.js"))
    }
}
