import { createRef } from "react"
import { Vector3 } from "three"

const state = {
  sections: 4,
  pages: 4,
  zoom: 1,
  images: [ "./react-client/public/835977.jpg",
            "./react-client/public/835978.jpg",
            "./react-client/public/835979.jpg",
          ],
  top: createRef()
}

export default state
