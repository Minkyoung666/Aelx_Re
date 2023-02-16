import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'
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
// const loadingBarElement = document.querySelector('.loading-bar')
// const loadingManager = new THREE.LoadingManager(
//     // Loaded
//     () =>
//     {
//         // Wait a little
//         window.setTimeout(() =>
//         {
//             // Animate overlay
//             gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 2, value: 0, delay: 1.5 })

//             // Update loadingBarElement
//             loadingBarElement.classList.add('ended')
//             loadingBarElement.style.transform = ''
//         }, 500)

//         window.setTimeout(() =>
//         {
//             sceneReady = true

//         }, 2000)
//     },

//     // Progress
//     (itemUrl, itemsLoaded, itemsTotal) =>
//     {
//         // Calculate the progress and update the loadingBarElement
//         const progressRatio = itemsLoaded / itemsTotal
//         loadingBarElement.style.transform = `scaleX(${progressRatio})`
//     }
// )
// const gltfLoader = new GLTFLoader(loadingManager)
// const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

/**
 * Base
 */
// Debug
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
//  * Overlay
//  */
// const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
// const overlayMaterial = new THREE.ShaderMaterial({
//     // wireframe: true,
//     transparent: true,
//     uniforms:
//     {
//         uAlpha: { value: 1 }
//     },
//     vertexShader: `
//         void main()
//         {
//             gl_Position = vec4(position, 1.0);
//         }
//     `,
//     fragmentShader: `
//         uniform float uAlpha;

//         void main()
//         {
//             gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
//         }
//     `
// })
// const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
// overlay.position.z = 3
// scene.add(overlay)

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            // child.material.envMap = environmentMap
           // child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
// const environmentMap = cubeTextureLoader.load([
//     '/textures/environmentMaps/0/px.jpg',
//     '/textures/environmentMaps/0/nx.jpg',
//     '/textures/environmentMaps/0/py.jpg',
//     '/textures/environmentMaps/0/ny.jpg',
//     '/textures/environmentMaps/0/pz.jpg',
//     '/textures/environmentMaps/0/nz.jpg'
// ])


const group = new THREE.Group()
   
    const a_material = new THREE.MeshNormalMaterial({wireframe : true})
    const al_material = new THREE.MeshNormalMaterial({wireframe : false, opacity : 0.6, transparent : true, depthWrite : false, depthTest: false})

    
    const algorithm = new THREE.Mesh (new THREE.OctahedronGeometry(3, 0),al_material,)
    algorithm.position.x = 0
    
    const algorithm2 = new THREE.Mesh (new THREE.OctahedronGeometry(4, 0),a_material)
    algorithm2.position.x = 0

    const al1gorithm = new THREE.Mesh (new THREE.OctahedronGeometry(3, 0),al_material)
    al1gorithm.position.x = 6

    const al1gorithm2 = new THREE.Mesh (new THREE.OctahedronGeometry(4, 0),a_material)
    
al1gorithm2.position.x = 6
group.position.x = -3
group.position.z = 0
group.add(al1gorithm2, al1gorithm, algorithm, algorithm2)
scene.add(group)


/**
 * points
 */

const points = [
    {
        position: new THREE.Vector3(-0.2, 1.5, 0),
        element: document.querySelector('.point-TX')
    },
    {
        position: new THREE.Vector3(-3, 0, -4.5),
        element: document.querySelector('.point-Reason')
    },
    {
        position: new THREE.Vector3(-3, 0, 4),
        element: document.querySelector('.point-CX')
    },
    {
        position: new THREE.Vector3(-3, -4.5, 0),
        element: document.querySelector('.point-objectivity')
    },
    {
        position: new THREE.Vector3(3, -4.5, 0),
        element: document.querySelector('.point-Subjectivity')
    },    
    {
        position: new THREE.Vector3(3, 4.5, 0),
        element: document.querySelector('.point-3rdperson')
    },  
    {
        position: new THREE.Vector3(-3, 4.5, 0),
        element: document.querySelector('.point-Stakeholder')
    },  
    {
        position: new THREE.Vector3(3, 0, 4),
        element: document.querySelector('.point-UX')
    },
    {
        position: new THREE.Vector3(3, 0, -4.5),
        element: document.querySelector('.point-Emotion')
    },
    {
        position: new THREE.Vector3(8, 0, 0),
        element: document.querySelector('.point-Output')
    },    
    {
        position: new THREE.Vector3(-8, 0, 0),
        element: document.querySelector('.point-Input')
    },
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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.01, 200)
camera.position.set(0, 0, 20)
scene.add(camera)


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
controls.autoRotate = true
controls.enablePan = false
controls.minDistance = 15
controls.maxDistance = 20
controls.maxPolarAngle = Math.PI * 0.5
controls.minPolarAngle = Math.PI * 0.35 

/**
 * Animate
 */

// Raycaster
const raycaster = new THREE.Raycaster()
const clock = new THREE.Clock()
let previousTime = 0
const cameraGroup = new THREE.Group()
cameraGroup.add (camera)
const tick = () =>
{
    // Update controls
    controls.update()

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


    // Update Mesh
    // particles.rotation.y = -E_time2 * 0.1
    
    const elapsedTime = clock.getElapsedTime()
    previousTime = elapsedTime
    const deltaTime = elapsedTime - previousTime
    // Animate Meshs

    // camera animate
    // const parallaxX = cursor.x * 1
    // const parallaxY = -cursor.y * 1

    // cameraGroup.position.x = (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    // cameraGroup.position.y = (parallaxY - cameraGroup.position.y) * 5 * deltaTime
    // Raycaster


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()