import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { AmbientLight, AxesHelper, CubeTexture, CubeTextureLoader, DirectionalLight, EllipseCurve, Mesh, MeshPhysicalMaterial } from 'three'



/**
 * Base
 */
// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')



// Scene
const scene = new THREE.Scene()
//scene.fog = new THREE.Fog(0xffffff, 3, 9)

// Loader

const gltfLoader = new GLTFLoader()
const cubeloader = new THREE.CubeTextureLoader()
const texturesloader = new THREE.TextureLoader()

// envimap
const environmentmap = cubeloader.load([
    '../static/textures/environmentMaps/5/px.png',
    '../static/textures/environmentMaps/5/nx.png',
    '../static/textures/environmentMaps/5/py.png',
    '../static/textures/environmentMaps/5/ny.png',
    '../static/textures/environmentMaps/5/pz.png',
    '../static/textures/environmentMaps/5/nz.png'
])

const backtext = texturesloader.load([
    '/textures/back.png'
])
const backtext_alpha = texturesloader.load([
    '/textures/back_alpha.png'
])

scene.background = environmentmap
environmentmap.encoding = THREE.sRGBEncoding
//scene.environment = environmentmap


// light

const D_light = new DirectionalLight (0xffffff, 1)
const A_light = new AmbientLight (0xb5a1e2, 1)
D_light.shadow.normalBias = 0.05
scene.add(D_light,A_light)

/**
 * Test sphere
 */
// const testbox = new THREE.Mesh(
//     new THREE.BoxGeometry(50, 32, 32),
//     new THREE.MeshStandardMaterial(0x020202)
// )

// testbox.position.z = -30
// scene.add(testbox)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// axis

// const center = new AxesHelper (10, 10, 10)
// scene.add(center)

/**
 * Camera
 */

// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 70
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.minDistance = 30
controls.maxDistance = 30
controls.maxPolarAngle = Math.PI * 0.4
controls.minPolarAngle = Math.PI * 0.2
controls.autoRotate = true
controls.autoRotateSpeed = 0.2

// Geometry
const particlesCount = 500
const positions = new Float32Array ( particlesCount * 3)
for (let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5 ) * 40
    positions[i * 3 + 1] = (Math.random() - 0.5 ) * 40
    positions[i * 3 + 2] = (Math.random() - 0.5 ) * 50
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const particlesMaterial = new THREE.PointsMaterial({
    color: new THREE.Color(0xffffff), sizeAttenuation : true,
    size: 0.05
})
const particles = new THREE.Points(particlesGeometry, particlesMaterial)


scene.add(particles)

// model


    //update all materials
    const clock = new THREE.Clock()

gltfLoader.load(
    '/models/plz.gltf',
    (gltf) =>
    {   
        console.log('성공')
        console.log(gltf)
        gltf.scene.position.set(0, -7, 0.5)
        gltf.scene.scale.set(0.7, 0.7, 0.7)


    const tick = () =>
    {
        
        const E_time = clock.getElapsedTime()

        // Update Mesh
        gltf.scene.rotation.y = E_time * 0.5
        //gltf.scene.rotation.x = E_time * 0.5


        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()

        scene.add(gltf.scene)

        // update 

        updateALLmaterials()
        }
    )

    const updateALLmaterials = () =>
    {
        scene.traverse((child) =>
        {
        if(child instanceof THREE.Mesh)
        {
            child.material = new THREE.MeshPhysicalMaterial
            child.material.color = new THREE.Color(0x6F7BFF)
        child.material.envMap = environmentmap
        child.material.envMapIntensity = 1
            child.material.metalness = 0.2
            child.material.roughness = 0.05,
            child.material.ior = 3,
            child.material.transmission = 1
            child.material.thickness = 1
            child.material.side = THREE.DoubleSide
            // child.castShadow = true
            // child.receiveShadow = true
        }
        })}

const planeM = new THREE.MeshStandardMaterial({map:backtext, alphaMap:backtext_alpha, envMap:null, envMapIntensity:0, transparent: true})
const planeG = new THREE.PlaneGeometry(160, 90)
const plane = new THREE.Mesh(planeG,planeM)
plane.position.z = -150
plane.position.y = -30
plane.lookAt(camera.position)
plane.position.set = camera.position
scene.add(plane)
console.log('일단', plane)
// //update all materials

// const updateALLmaterials = () =>
// {
//     scene.traverse((child) =>
//     {
//     if(child instanceof THREE.Mesh)
//     {
//         child.material = new THREE.MeshPhysicalMaterial
//         child.material.color = new THREE.Color(0x6F7BFF)
//        child.material.envMap = environmentmap
//        child.material.envMapIntensity = 1
//         child.material.metalness = 0.2
//         child.material.roughness = 0,
//         child.material.ior = 3,
//         child.material.transmission = 0.5,
//         child.material.thickness = 1,
//         child.material.side = THREE.DoubleSide
//         // child.castShadow = true
//         // child.receiveShadow = true
//     }
//     })
// }






/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true

})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setClearAlpha(0)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



/**
 * Animate
 */



const tick = () =>
{
    const E_time2 = clock.getElapsedTime()

    // Update Mesh
    particles.rotation.y = -E_time2 * 0.1


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()