import React, { Component, Suspense, useEffect, useRef, useMemo } from 'react';
import { Canvas, Dom, useLoader, useFrame } from "react-three-fiber"
import {Html} from "@react-three/drei"
import { TextureLoader, LinearFilter } from "three"
import lerp from "lerp"
import { Text, MultilineText } from "./Text"
// import Plane from "./Plane"
import "./CustomMaterial"
import { Block, useBlock } from "./blocks"
import state from "./store"
import Menu from './Menu.jsx';

function Plane({ color = "white", ...props }) {
  return (
    <mesh {...props}>
      <planeBufferGeometry attach="geometry" />
      <meshBasicMaterial attach="material" color={color} />
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

function Content({ left, children }) {
  const { contentMaxWidth, canvasWidth, margin } = useBlock()
  const aspect = 1.75
  const alignRight = (canvasWidth - contentMaxWidth - margin) / 2
  return (
    <group position={[alignRight * (left ? -1 : 1), 0, 0]}>
      <Plane scale={[contentMaxWidth, contentMaxWidth / aspect, 1]} color="#bfe2ca" />
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
  const { contentMaxWidth, mobile } = useBlock()
  const aspect = 1.75
  const pixelWidth = contentMaxWidth * state.zoom
  return (
    <>
      {/* First section */}
      <Block factor={1.5} offset={0}>
          <Content left >
            <Html style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "left" }} position={[-contentMaxWidth / 2, -contentMaxWidth / 2 / aspect - 0.4, 1]}>
              The substance can take you to heaven but it can also take you to hell.
            </Html>
          </Content>
        </Block>
        {/* Second section */}
        <Block factor={2.0} offset={1}>
          <Content />
        </Block>
        {/* Stripe */}
        <Block factor={-1.0} offset={1}>
          <Stripe />
        </Block>
        {/* Last section */}
        <Block factor={1.5} offset={2}>
          <Content left>
            <Block factor={-0.5}>
              <Cross />
            </Block>
          </Content>
        </Block>
    </>
  )
}

function App() {
    const scrollArea = useRef()
    const onScroll = e => (state.top.current = e.target.scrollTop)
    useEffect(() => void onScroll({ target: scrollArea.current }), [])
    return (
      <>
      <Canvas className="canvas" concurrent pixelRatio={1} orthographic camera={{ zoom: 75, position: [0, 0, 500] }}>
        <Suspense fallback={<Dom center className="loading" children="Loading..." />}>
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