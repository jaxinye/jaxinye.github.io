import React, { Component } from 'react';
import * as THREE from 'three';
import C from 'cannon';
import OrbitControls from 'three-orbitcontrols';

import MenuDrop from './MenuDrop';

// import CannonDebugRenderer from './utils/CannonDebugRenderer';
const distance = 15
class Menu extends Component {

    constructor(props){
        super(props)
        this.state = { width: window.innerWidth, height: window.innerHeight };
    }

    componentDidMount() {
        window.addEventListener('resize', () => {this.onResize()})
        this.world = new C.World()
        this.world.gravity.set(0, -50, 0)

        this.scene = new THREE.Scene()
        this.scene.fog = new THREE.Fog(0x202533, -10, 100)

        this.setCamera()
        this.setLights()
        this.setRender()
        this.addObjects()
        
        var animate = () => {
          requestAnimationFrame( animate );
          this.renderer.render( this.scene, this.camera );
        };
        animate();
        // this.setupDebug()
      }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
        this.mount.removeChild(this.renderer.domElement);
    }

    onResize() {
        // const W = window.innerWidth;
        // const H = window.innerHeight;
        const W = this.mount.clientWidth;
        const H = this.mount.clientHeight;
        this.camera.aspect = W / H

        this.camera.top    = distance
        this.camera.right  = distance * this.camera.aspect
        this.camera.bottom = -distance
        this.camera.left   = -distance * this.camera.aspect

        this.camera.updateProjectionMatrix()
        this.renderer.setSize(W, H)
        this.renderer.render( this.scene, this.camera );
    }

    setCamera() {
        // const W = window.innerWidth;
        // const H = window.innerHeight;
        const W = this.mount.clientWidth;
        const H = this.mount.clientHeight;
        const aspect = W / H

        this.camera = new THREE.OrthographicCamera(-distance * aspect, distance * aspect, distance, -distance, -10, 100)

        this.camera.position.set(-10, 10, 10)
        this.camera.lookAt(new THREE.Vector3())
    }

    setLights() {
        const ambient = new THREE.AmbientLight(0xcccccc)
        this.scene.add(ambient)

        const foreLight = new THREE.DirectionalLight(0xffffff, 0.5)
        foreLight.position.set(5, 5, 20)
        this.scene.add(foreLight)

        const backLight = new THREE.DirectionalLight(0xffffff, 1)
        backLight.position.set(-5, -5, -10)
        this.scene.add(backLight)
    }

    setRender() {
        // this.$stage = document.getElementById('app')
        this.renderer = new THREE.WebGLRenderer();
        // this.$stage.appendChild(this.renderer.domElement );
        this.mount.appendChild(this.renderer.domElement);

        this.renderer.setClearColor(0x0c0f13)
        this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight)
        this.renderer.setPixelRatio(window.devicePixelRatio)

        this.renderer.setAnimationLoop(() => { this.draw() })
    }

    addObjects() {
        this.menu = new MenuDrop(this.scene, this.world, this.camera, this.renderer)
    }

    // setupDebug() {
    //     this.dbr = new CannonDebugRenderer(this.scene, this.world)

    //     this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    //     this.controls.enableKeys = false
    //     this.controls.update()
    // }

    draw() {
        this.updatePhysics()
        this.renderer.render(this.scene, this.camera)
    }

    updatePhysics() {
        if (this.dbr) this.dbr.update()

        this.menu.update()

        this.world.step(1 / 60)
    }

    render() {
        return (
            <div className="viewport" ref={(mount) => { this.mount = mount }} />
        )
    }
}

export default Menu;