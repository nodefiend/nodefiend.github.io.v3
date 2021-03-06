// code pen: https://codesandbox.io/embed/r3f-montage-jz9l97qn89
// NOTE: dynamically import non server side rendered things:
// https://github.com/asyncapi/asyncapi-react/issues/177#issuecomment-729823940
// NOTE: dynamic import with laoding:
// https://web.dev/code-splitting-with-dynamic-imports-in-nextjs/

import * as THREE from 'three'
import ReactDOM from 'react-dom'
import { useColorMode } from "@chakra-ui/react"
import React, { useEffect } from 'react'
import { Canvas } from 'react-three-fiber'
import { useSprings } from 'react-spring/three.cjs';
import { a } from 'react-spring/three.cjs';


export const darkModeColors = [
  'rgb(84, 56, 100)',
  'rgb(255, 99, 99)',
  'rgb(238, 187, 77)',
]

export const lightModeColors = [
  'rgb(227, 223, 200)',
  'rgb(245, 241, 218)',
  'rgb(150, 187, 124)',
  'rgb(238, 187, 77)',
]

const r = Math.random()

const defaultColors = lightModeColors

const defaultScale = [1 + r * 14, 1 + r * 14, 1]

export default React.memo(function HeroGraphic ({scale = defaultScale}) {
  const { colorMode } = useColorMode()

  const colors = (colorMode == "light" ?  lightModeColors : darkModeColors)

  const number = 20

  const Lights = () => {
    return (
      <group>
        <pointLight intensity={0.3} />
        <ambientLight intensity={2} />
        <spotLight
          castShadow
          intensity={0.2}
          angle={Math.PI / 7}
          position={[150, 150, 250]}
          penumbra={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
      </group>
    )
  }

  const random = i => {
    return {
      position: [100 - Math.random() * 200, 100 - Math.random() * 200, i * 1.5],
      color: colors[Math.round(Math.random() * (colors.length - 1))],
      scale: scale,
      rotation: [0, 0, THREE.Math.degToRad(Math.round(Math.random()) * 45)]
    }
  }

  const data = new Array(number).fill().map(() => {
    return {
      color: colors[Math.round(Math.random() * (colors.length - 1))],
      args: [0.1 + Math.random() * 9, 0.1 + Math.random() * 9, 10]
    }
  })

  const Content = () => {
    const [springs, set] = useSprings(number, i => ({
      from: random(i),
      ...random(i),
      config: { mass: 20, tension: 150, friction: 50 }
    }))
    useEffect(() => void setInterval(() => set(i => ({ ...random(i), delay: i * 40 })), 3000), [])
    return data.map((d, index) => (
      <a.mesh key={index} {...springs[index]} castShadow receiveShadow>
        <boxBufferGeometry attach="geometry" args={d.args} />
        <a.meshStandardMaterial attach="material" color={springs[index].color} roughness={0.75} metalness={0.5} />
      </a.mesh>
    ))
  }

  const graphicStyles = {
    zIndex: 999,
    position: 'absolute',
    width: '100%',
    height: '100%',
  }

  return (
    <div style={graphicStyles}>
      <Canvas shadowMap camera={{ position: [0, 0, 100], fov: 100 }}>
        <Lights />
        <Content />
      </Canvas>
    </div>
  )
})

// ReactDOM.render(<HeroGraphic />, document.getElementById('root'))
