import "core-js/stable"
import "regenerator-runtime/runtime"

import { CustomSprite } from "CustomSprite"
customElements.define("custom-sprite", CustomSprite)
document.body.appendChild(document.createElement("custom-sprite"))
