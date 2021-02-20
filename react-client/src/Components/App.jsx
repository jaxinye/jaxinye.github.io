import React, { Component, Suspense, useEffect, useRef, useMemo } from 'react';
import { Canvas, Dom, useLoader, useFrame } from "react-three-fiber"
import { Html, useTexture, OrbitControls } from "@react-three/drei"
import { TextureLoader, LinearFilter } from "three"
import lerp from "lerp"
import { Text, MultilineText } from "./Text"
// import Plane from "./Plane"
import "./CustomMaterial"
import "./dotmaterial"
import { Block, useBlock } from "./blocks"
import state from "./store"
import Menu from './Menu.jsx';


const ROW = 50
const COL = 50
const NUM = ROW * COL

function Particles({ pointCount }) {
  const { contentMaxWidth } = useBlock()
  const [coords, sizes] = useMemo(() => {
    const initialCoords = []
    const initialSizes = []
    let i = 0
    for (let y = 0; y < ROW; y += 1) {
      for (let x = 0; x < COL; x += 1) {
        initialCoords.push(x)
        initialCoords.push(y)
        initialCoords.push(i)
        initialSizes.push(Math.random() < 0.03 ? 15 : 6)
        i++
      }
    }

    const coords = new Float32Array(initialCoords)
    const sizes = new Float32Array(initialSizes)
    return [coords, sizes]
  }, [pointCount])

  const geom = useRef()
  useFrame((state) => {
    geom.current.material.uniforms.time.value = state.clock.getElapsedTime()
    geom.current.geometry.verticesNeedUpdate = true
  })

  return (
    <points ref={geom} position={[0, 10, 0]} rotation={[-Math.PI / 4, 0, Math.PI / 6]}>
      <bufferGeometry>
        <bufferAttribute attachObject={["attributes", "position"]} count={coords.length / 3} array={coords} itemSize={3} />
        <bufferAttribute attachObject={["attributes", "size"]} count={sizes.length} array={sizes} itemSize={1} />
      </bufferGeometry>
      <dotMaterial />
    </points>
  )
}
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
    <Plane scale={[100, contentMaxWidth, 1]} rotation={[0, 0, Math.PI / 4]} position={[0, 0, -20]} color="#000" />
  )
}

function Pages() {
  //const textures = useTexture("./react-client/public/photo-1515036551567-bf1198cccc35.jpeg")
  const texture1 = new TextureLoader().load( "./react-client/public/IMG_6982.JPG" )
  const texture2 = new TextureLoader().load( "./react-client/public/835978.jpg" )
  const texture3 = new TextureLoader().load( "./react-client/public/cat.jpg" )
  const textures = [texture1, texture2, texture3]
  const [img1, img2, img3] = textures.map(texture => ((texture.minFilter = LinearFilter), texture))
  const { contentMaxWidth: w, canvasWidth, canvasHeight, mobile } = useBlock()
  const aspect = 1.75
  const pixelWidth = w * state.zoom * 75
  const size = aspect < 1 && !mobile ? 0.65 : 1
  return (
    <>
      {/* First section */}
      <Block factor={1.5} offset={0.1}>
        <Content left map={img1}>
          <Html style={{ width: pixelWidth * 2 / (mobile ? 1 : 2)}} position={[-w / 2, -w / 2 / aspect - 0.4, 1]}>
            Jiaxin Ye, a.k.a YJX/YE/葉佳鑫, a nocturnal programmer who believes JavaScript can take you to heaven but it can also take you to hell. I love all brilliant and multicolored stuff. Design is all about the emotions and colors 🌈. 
          </Html>
        </Content>
        <MultilineText top left size={w * 0.1} lineHeight={w / 5} position={[(w / 3.5) * size, (w * size * 0.5) / aspect / 3, -21]} color="#2fe8c3" text={"$YJX"} />
        <Text opacity={0.7} size={w * 0.07} color="#000" position={[(w / 2) * size, (w * size * 0.5) / aspect / 3 - w / 5, -21]}>
          {"FEE@FB"}
        </Text>
      </Block>
      <Block factor={1.2} offset={-0.2}>
        <MultilineText top left size={w * 0.15} lineHeight={w / 5} position={[-w / 3.5, 0, -1]} color="#2fe8c3" text={"INTRO"} />
      </Block>

      <Block factor={1.6} offset={1-0.38}>
        <MultilineText top left size={w * 0.15} lineHeight={w / 5} position={[-w / 3.5, 0, -1]} color="#ee9ca7" text={"GAME\nFIRST!!"} />
      </Block>

      {/* Second section */}
      <Block factor={2.0} offset={1}>
        <Content map={img2}>
          <Html style={{ width: pixelWidth * 2 / (mobile ? 1 : 2)}} position={[(-w * size) / 2, -w / 2 / aspect - 0.4, 1]}>
            THE Coral Highlands Killing Machine. 🎰
            S+ Splat Zones Player, Favorite MAP - Walleye Warehouse, 🔫
            Top tier midlaner in WZRY (王者荣耀), 不服solo哈. 👁 
          </Html>
        </Content>
        <Text opacity={1} size={w * 0.07} rotation={[0, 0, Math.PI / 4]} color="#ffdde1" position={[(-w / 2) * size, (w * size * 0.5) / aspect / 3 + w / 10, 0]}>
          {"MHW"}
        </Text>
        <Text opacity={0.7} size={w * 0.07} color="#ffdde1" position={[(-w / 2) * size, (w * size * 0.5) / aspect / 3 , 0]}>
          {"Splatoon!!"}
        </Text>
        <Text opacity={0.4} size={w * 0.07} color="#ffdde1" position={[(-w / 2) * size, (w * size * 0.5) / aspect / 3 - w / 10, 0]}>
          {"LoZ"}
        </Text>
        <Text opacity={0.2} size={w * 0.07} color="#ffdde1" position={[(-w / 2) * size, (w * size * 0.5) / aspect / 3 - 2 * w / 10, 0]}>
          {"wzry"}
        </Text>
      </Block>

      <Block factor={2.5} offset={1.5}>
        <MultilineText top left size={w * 0.15} rotation={[0, 0, Math.PI / 6]} lineHeight={w / 5} position={[-w / 2.5, (w * size ) / aspect / 3, -1]} color="#f7971e" text={"MEET\nMY\nBAE(=.=)\n.\n.\n."} />
        {/* <Particles pointCount={NUM} />
        <OrbitControls /> */}
      </Block>
      {/* Stripe */}
      <Block factor={-1.0} offset={1}>
        <Stripe />
      </Block>
      {/* Last section */}
      <Block factor={3} offset={2}>
        <Content left map={img3}>
          {/* <Block factor={-0.5}>
            <Cross />
          </Block> */}
        </Content>
        <Text opacity={1} size={w * 0.07} color="#ffd200" position={[(w / 2) * size, (w * size * 0.5) / aspect / 3 - w / 5, 0]}>
          {"Boots"}
        </Text>
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