import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/roundedboxgeometry'
import * as dat from 'lil-gui'
import { Vector3 } from 'three'


/**
 * Gui
 */
//const gui = new dat.GUI()



/**
 * Loaders
 */
let sceneReady = true

/**
 * Base
 */
// Debug
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Loader

const gltfLoader = new GLTFLoader()
const cubeloader = new THREE.CubeTextureLoader()
const texturesloader = new THREE.TextureLoader()

// Texture

const Matcap_1 = texturesloader.load('../static/textures/matcap/1.png')

const cube1_envMap = cubeloader.load([
    '../static/textures/environmentMaps/5/px.png',
    '../static/textures/environmentMaps/5/nx.png',
    '../static/textures/environmentMaps/5/py.png',
    '../static/textures/environmentMaps/5/ny.png',
    '../static/textures/environmentMaps/5/pz.png',
    '../static/textures/environmentMaps/5/nz.png'
])

// Cubes

const group = new THREE.Group()
   
    const a_material = new THREE.MeshNormalMaterial({wireframe : true})
    const al_material = new THREE.MeshNormalMaterial({wireframe : false, transparent : true, depthWrite : false, depthTest: false})
    const Mat_material = new THREE.MeshMatcapMaterial({matcap : Matcap_1})

    const round_geo = new RoundedBoxGeometry(10, 10, 10, 6, 2)
    
    const cube_1 = new THREE.Mesh(round_geo, Mat_material)
    cube_1.position.x = -15
    const cube_2 = new THREE.Mesh(round_geo, al_material)
    cube_2.position.x = 0
    const cube_3 = new THREE.Mesh(round_geo, al_material)        
    cube_3.position.x = 15


group.position.z = 0
group.add(cube_1, cube_2, cube_3, )
scene.add(group)


/**
 * points
 */

const points = [
    {
        position: new THREE.Vector3(17, -9, 0),
        element: document.querySelector('.point-TX')
    },
    {
        position: new THREE.Vector3(-17, -9, 0),
        element: document.querySelector('.point-Reason')
    },
    {
        position: new THREE.Vector3(0, -9, 0),
        element: document.querySelector('.point-CX')
    },
    // {
    //     position: new THREE.Vector3(30, 0, 0),
    //     element: document.querySelector('.point-Output')
    // },    
    // {
    //     position: new THREE.Vector3(-25, 0, 0),
    //     element: document.querySelector('.point-Input')
    // },
]
console.log(points)


/**
 * Lights
 */
// const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
// directionalLight.castShadow = true
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.normalBias = 0.05
// directionalLight.position.set(0.25, 3, - 2.25)
// scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/** 이벤트리스너
 * 
 */

window.addEventListener('mousemove', (e) =>
{
    cursor.x = e.clientX / sizes.width
    cursor.y = e.clientY / sizes.height})

// cursor

const cursor = {}
cursor.x = 0
cursor.y = 0


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    // document.body.appendChild(renderer.domElement)
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.01, 500)
camera.position.set(0, 0, 50)
scene.add(camera)

const cameraGroup = new THREE.Group()
cameraGroup.add(camera)
scene.add(cameraGroup)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha : true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearAlpha(0)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.autoRotate = true
controls.enablePan = true
controls.minDistance = 50
controls.maxDistance = 50
controls.maxPolarAngle = Math.PI 
controls.minPolarAngle = 0
controls.maxAzimuthAngle = Math.PI * 1
controls.minAzimuthAngle = Math.PI * 1

/**
 * Animate
 */

// Raycaster
const raycaster = new THREE.Raycaster()
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{

    
    // Update Mesh
    // particles.rotation.y = -E_time2 * 0.1
    
    const elapsedTime = clock.getElapsedTime()
    previousTime = elapsedTime
    const deltaTime = elapsedTime - previousTime

    // camera animate
    const parallaxX = cursor.x * 1
    const parallaxY = -cursor.y * 1

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 50 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 50 * deltaTime
    
    // scenes ready
    if(sceneReady)
    {
    // Go through each point
    for(const point of points)
    {
        const screenPosition = point.position.clone()
        screenPosition.project(camera)

        raycaster.setFromCamera(screenPosition, camera)
        const intersects = raycaster.intersectObjects(scene.children, true)

        if(intersects.length === 0)
        {
            point.element.classList.add('visible')
        }
        else
        {
            const intersectionDistance = intersects[0].distance
            const pointDistance = point.position.distanceTo(camera.position)

            if(intersectionDistance < [pointDistance])
            {
                point.element.classList.remove('visible')
            }
            else
            {
                point.element.classList.add('visible')
            }
        }

        const translateX = screenPosition.x * sizes.width * 0.5
        const translateY = - screenPosition.y * sizes.height * 0.5

        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
        
    }}


    
    // Animate Meshs

    cube_1.rotation.z = elapsedTime / (Math.PI / 0.5)
    cube_2.rotation.z = elapsedTime / (Math.PI / 0.6)
    cube_3.rotation.z = elapsedTime / (Math.PI / 0.55)
    
    cube_1.rotation.y = elapsedTime / (Math.PI / 0.5)
    cube_2.rotation.y = elapsedTime / (Math.PI / 0.5)
    cube_3.rotation.y = elapsedTime / (Math.PI / 0.5)

    // Raycaster

    // Update controls
    controls.update()


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()