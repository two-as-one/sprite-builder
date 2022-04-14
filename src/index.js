import "core-js/stable"
import "regenerator-runtime/runtime"

import { HelloWorld } from "HelloWorld"
customElements.define("hello-world", HelloWorld)
document.body.appendChild(document.createElement("hello-world"))
