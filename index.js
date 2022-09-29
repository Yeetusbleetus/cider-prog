const path = require("path")
const {ipcMain} = require("electron")
const writeFileSync = require('fs').writeFileSync;
const mkdirSync = require('fs').mkdirSync;
module.exports = class moai {
    constructor(env) {
        this.env = env
        this.playing = null;
    }
    onReady(win) {
        if (!existsSync(`${this.env.dir}/dist`)) {
            mkdirSync(`${this.env.dir}/dist`);
        }
        ipcMain.on('wsapi-updatePlaybackState', (event, attributes) => {
            try {
                writeFileSync(`${this.env.dir}/dist/data.txt`, JSON.stringify(attributes))
            } catch(e) {
                console.log("[Error]",e)
            }
        })
    }
    onRendererReady(win) {
        console.debug("Renderer Ready Called")
        this.env.utils.loadJSFrontend(path.join(this.env.dir, "index.frontend.js"))
    }
}
