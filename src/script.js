import * as THREE from '../../node_modules/three'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from '../../node_modules/gsap'
import * as dat from '../../node_modules/lil-gui'
import { AmbientLight, AxesHelper, CubeTexture, CubeTextureLoader, DirectionalLight, EllipseCurve, MeshPhysicalMaterial } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')



// Scene
const scene = new THREE.Scene()
//scene.fog = new THREE.Fog(0xffffff, 3, 9)

// Loader

const gltfLoader = new GLTFLoader()
const cubeloader = new THREE.CubeTextureLoader()

// envimap
const environmentmap = cubeloader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

//scene.background = environmentmap


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

const material = new THREE.MeshPhysicalMaterial()


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

const Alex_cube = gltfLoader.load(
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

//update all materials

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
        child.material.side = THREE.DoubleSide
        // child.castShadow = true
        // child.receiveShadow = true
    }
    })
}


// //update all materials

// const updateALLmaterials = () =>
// {
//     scene.traverse((child) =>
//     {
//     if(child instanceof THREE.Mesh)
//     {
//         child.material = new THREE.MeshPhysicalMaterial
//         child.material.color = 0x6F7BFF
//        child.material.envMap = environmentmap
//        child.material.envMapIntensity = 0.3
//         child.material.metalness = 1
//         child.material.roughness = 0.05,
//         child.material.ior = 2.5,
//         child.material.transmission = 1
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

const clock = new THREE.Clock()


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