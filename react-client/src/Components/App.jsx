import React, { Component, Suspense, useEffect, useRef, useMemo } from 'react';
import { Canvas, Dom, useLoader, useFrame } from "react-three-fiber"
import { Html, useTexture } from "@react-three/drei"
import { TextureLoader, LinearFilter } from "three"
import lerp from "lerp"
import { Text, MultilineText } from "./Text"
// import Plane from "./Plane"
import "./CustomMaterial"
import { Block, useBlock } from "./blocks"
import state from "./store"
import Menu from './Menu.jsx';

function Plane({ color = "white", map, ...props }) {
  const { viewportHeight, offsetFactor } = useBlock()
  const material = useRef()
  let last = state.top.current
  useFrame(() => {
    const { pages, top } = state
    material.current.scale = lerp(material.current.scale, offsetFactor - top.current / ((pages - 1) * viewportHeight * 100), 0.1)
    material.current.shift = lerp(material.current.shift, (top.current - last) / 70, 0.1)
    last = top.current
  })
  return (
    <mesh {...props}>
      <planeBufferGeometry attach="geometry" args={[1, 1, 32, 32]}/>
      <customMaterial ref={material} attach="material" color={color} map={map} />
    </mesh>
  )
}

function Startup() {
  const ref = useRef()
  useFrame(() => (ref.current.material.opacity = lerp(ref.current.material.opacity, 0, 0.025)))
  return (
    <mesh ref={ref} position={[0, 0, 200]} scale={[100, 100, 1]}>
      <planeBufferGeometry attach="geometry" />
      <meshBasicMaterial attach="material" color="#070712" transparent />
    </mesh>
  )
}

function Cross() {
  const ref = useRef()
  const { viewportHeight } = useBlock()
  useFrame(() => {
    const curTop = state.top.current
    const curY = ref.current.rotation.z
    const nextY = (curTop / ((state.pages - 1) * viewportHeight * state.zoom * 75)) * Math.PI
    ref.current.rotation.z = lerp(curY, nextY, 0.1)
  })
  return (
    <group ref={ref} scale={[2, 2, 2]}>
      <Plane scale={[1, 0.3, 0.3]} color="#d40749" />
      <Plane scale={[0.3, 1, 0.3]} color="#d40749" />
    </group>
  )
}

function Content({ left, children, map }) {
  const { contentMaxWidth, canvasWidth, margin } = useBlock()
  const aspect = 1.75
  const alignRight = (canvasWidth - contentMaxWidth - margin) / 2
  return (
    <group position={[alignRight * (left ? -1 : 1), 0, 0]}>
      <Plane scale={[contentMaxWidth, contentMaxWidth / aspect, 1]} map={map}/>
      {children}
    </group>
  )
}

function Stripe() {
  const { contentMaxWidth } = useBlock()
  return (
    <Plane scale={[100, contentMaxWidth, 1]} rotation={[0, 0, Math.PI / 4]} position={[0, 0, -1]} color="#000" />
  )
}

function Pages() {
  console.log(state.images)
  //const textures = useTexture("./react-client/public/photo-1515036551567-bf1198cccc35.jpeg")
  const texture1 = new TextureLoader().load( "./react-client/public/835977.jpg" )
  const texture2 = new TextureLoader().load( "./react-client/public/835978.jpg" )
  const texture3 = new TextureLoader().load( "./react-client/public/835979.jpg" )
  const textures = [texture1, texture2, texture3]
  console.log(textures)
  const [img1, img2, img3] = textures.map(texture => ((texture.minFilter = LinearFilter), texture))
  console.log(img1)
  const { contentMaxWidth, mobile } = useBlock()
  const aspect = 1.75
  const pixelWidth = contentMaxWidth * state.zoom * 75
  return (
    <>
      {/* First section */}
      <Block factor={1.5} offset={0}>
          <Content left map={img1}>
            <Html style={{ width: pixelWidth / (mobile ? 1 : 2)}} position={[-contentMaxWidth / 2, -contentMaxWidth / 2 / aspect - 0.4, 1]}>
              The substance can take you to heaven but it can also take you to hell.
            </Html>
          </Content>
        </Block>
        {/* Second section */}
        <Block factor={2.0} offset={1}>
          <Content map={img2}/>
        </Block>
        {/* Stripe */}
        <Block factor={-1.0} offset={1}>
          <Stripe />
        </Block>
        {/* Last section */}
        <Block factor={1.5} offset={2}>
          <Content left map={img3}>
            <Block factor={-0.5}>
              <Cross />
            </Block>
          </Content>
        </Block>
    </>
  )
}

function App() {
    // const textures = useTexture("http://placehold.it/120x120&text=image1")
    const scrollArea = useRef()
    const onScroll = e => (state.top.current = e.target.scrollTop)
    useEffect(() => void onScroll({ target: scrollArea.current }), [])
    return (
      <>
      <Canvas className="canvas" concurrent pixelRatio={1} orthographic camera={{ zoom: 75, position: [0, 0, 500] }}>
        <Suspense fallback={<Html center className="loading" children="Loading..." />}>
          <Pages />
          {/* <Diamonds /> */}
          <Startup />
        </Suspense>
        
      </Canvas>

      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        <div style={{ height: `${state.pages * 100}vh` }} />
        <div className="flex-row-container">
          <Menu />
      </div>
      </div>


      </>
    )
}
export default App;