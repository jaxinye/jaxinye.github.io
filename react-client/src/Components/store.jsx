import { createRef } from "react"
import { Vector3 } from "three"

const state = {
  sections: 3,
  pages: 4,
  zoom: 1,
  images: [ "./react-client/public/photo-1515036551567-bf1198cccc35.jpeg",
            "./react-client/public/photo-1519608487953-e999c86e7455.jpeg",
            "./react-client/public/photo-1533577116850-9cc66cad8a9b.jpeg",
          ],
  top: createRef()
}

export default state
