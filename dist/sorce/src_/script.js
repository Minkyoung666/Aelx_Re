import * as THREE from '../../node_modules/three'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from '../../node_modules/gsap'
import * as dat from '../../node_modules/lil-gui'
import { AmbientLight, AxesHelper, CubeTexture, CubeTextureLoader, DirectionalLight, EllipseCurve, Mesh, MeshPhysicalMaterial } from '../../node_modules/three'



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

// copy materials

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
    '../static/textures/back.png'
])
const backtext_alpha = texturesloader.load([
    '../static/textures/back_alpha.png'
])
const normalMapTexture = texturesloader.load([
    '../static/textures/normal.png'
])

const options = {
    transmission: 1,
    thickness: 1.2,
    roughness: 0.6,
    envMapIntensity: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    normalScale: 0.5,
    clearcoatNormalScale: 0.3,
    normalRepeat: 1,
    bloomThreshold: 0.85,
    bloomStrength: 0.5,
    bloomRadius: 0.33,
};

const material = new THREE.MeshPhysicalMaterial({
    transmission: options.transmission,
    thickness: options.thickness,
    roughness: options.roughness,
    envMap: environmentmap,
    envMapIntensity: options.envMapIntensity,
    clearcoat: options.clearcoat,
    clearcoatRoughness: options.clearcoatRoughness,
    normalScale: new THREE.Vector2(options.normalScale),
    normalMap: normalMapTexture,
    clearcoatNormalMap: normalMapTexture,
    clearcoatNormalScale: new THREE.Vector2(options.clearcoatNormalScale),
  });




normalMapTexture.wrapS = THREE.RepeatWrapping;
normalMapTexture.wrapT = THREE.RepeatWrapping;
normalMapTexture.repeat.set(options.normalRepeat, options.normalRepeat);

scene.background = environmentmap
environmentmap.encoding = THREE.sRGBEncoding
//scene.environment = environmentmap


// light

const D_light = new DirectionalLight (0xffffff, 1)
const A_light = new AmbientLight (0xb5a1e2, 1)
D_light.shadow.normalBias = 0.05
scene.add(D_light,A_light)


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

let scrolly = window.scrollY

// axis

// const center = new AxesHelper (10, 10, 10)
// scene.add(center)

/**
 * Camera
 */


// Base camera
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 70

scene.add(camera)

// Group
const cameraGroup = new THREE.Group()
cameraGroup.add(camera)
scene.add(cameraGroup)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.minDistance = 30
controls.maxDistance = 30
controls.maxPolarAngle = Math.PI * 0.55
controls.minPolarAngle = Math.PI * 0.45
controls.autoRotate = true
controls.autoRotateSpeed = 0.2
controls.maxAzimuthAngle = Math.PI * 1.1
controls.minAzimuthAngle = Math.PI * 0.9

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

    const clock = new THREE.Clock()


   

gltfLoader.load('../static/models/plz.gltf', 
    (gltf) =>{
        const children = [...gltf.scene.children]
        for(const child of children)
        {
            child.scale.set(1.7, 1.7, 1.7)
            child.position.set(0, 0, 0)
            child.material = new THREE.MeshPhysicalMaterial
            child.material.color = new THREE.Color(0x6F7BFF)
        child.material.envMap = environmentmap
        child.material.envMapIntensity = 1.5
            child.material.metalness = 0.2
            child.material.roughness = 0.1,
            child.material.ior = 3,
            child.material.transmission = 1,
            child.material.thickness = 0.3,
            child.material.clearcoat = options.clearcoat,
            child.material.side = THREE.DoubleSide
            child.material.normalScale = new THREE.Vector2(options.normalScale),
            child.material.normalMap = normalMapTexture
            
            const tick = () =>
            {
                const E_time2 = clock.getElapsedTime()
            
                // Update Mesh
                child.rotation.z = -E_time2 * 0.1
                child.rotation.y = -E_time2 * 0.1
            
                // Call tick again on the next frame
                window.requestAnimationFrame(tick)
            }
            tick() 
            scene.add(child)
        }
       console.log(children)
    })


const planeM = new THREE.MeshStandardMaterial({map:backtext, alphaMap:backtext_alpha, envMap:null, envMapIntensity:0, transparent: true})
const planeG = new THREE.PlaneGeometry(64, 36)
const plane = new THREE.Mesh(planeG,planeM)
plane.position.z = 20
plane.position.y = 0
plane.rotation.x = Math.PI 
plane.rotation.z = Math.PI
scene.add(plane)
//plane.lookAt(camera.position)
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


   

// gltfLoader.load('/models/plz.gltf', 
//     (gltf) =>{
//         const tick = () => { 

//         const children = [...gltf.scene.children]
//         for(const child of children)
//         {
//             child.scale.set(1.7, 1.7, 1.7)
//             child.position.set(0, -1, 0)
        
//         const updateALLmaterials = () =>
//         scene.traverse((child) =>
//         {
//         if(child instanceof THREE.Mesh)
//         {
//             child.material = new THREE.MeshPhysicalMaterial
//             child.material.color = new THREE.Color(0x6F7BFF)
//         child.material.envMap = environmentmap
//         child.material.envMapIntensity = 1
//             child.material.metalness = 0.2
//             child.material.roughness = 0,
//             child.material.ior = 3,
//             child.material.transmission = 1,
//             child.material.thickness = 1,
//             child.material.side = THREE.DoubleSide
//             // child.castShadow = true
//             // child.receiveShadow = true
//         }
//         })
//             updateALLmaterials ()
//             scene.add(child)
//         }}
//         tick ()
//         console.log(children)
//     })



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

// cursor

const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (e) =>
{
    cursor.x = e.clientX /sizes.width
    cursor.y = e.clientY / sizes.height
} )


/**
 * Animate
 */

let previousTime = 0

const tick = () =>
{
    const E_time2 = clock.getElapsedTime()
    const deltaTime = E_time2 - previousTime
    previousTime = E_time2

    // Update Mesh
    particles.rotation.y = -E_time2 * 0.1

    // camera animate
    const parallaxX = cursor.x * 1
    const parallaxY = -cursor.y * 1

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 15 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 15 * deltaTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()