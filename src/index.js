import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Configuração da cena e câmera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 )
const modelLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize( window.innerWidth, window.innerHeight )
document.querySelector('#app').appendChild( renderer.domElement )
renderer.shadowMap.enabled = true
const controls = new OrbitControls(camera, renderer.domElement)

controls.listenToKeyEvents( window )

// Adiciona ponto de luz
const light = new THREE.PointLight(0xffffff, 1.3)
// Habilitar sombra
light.castShadow = true
light.position.y = 100
scene.add(light)

// Adiciona luz ambiente
const ambient = new THREE.AmbientLight(0x888888)
scene.add(ambient)

// Adiciona água como cilindro
const waterGeometry = new THREE.CylinderGeometry(300, 100, 5, 25)
const waterTexture = textureLoader.load('./textures/water.jpg')
waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping
waterTexture.repeat = new THREE.Vector2(20, 20)
const waterMaterial = new THREE.MeshPhongMaterial({map: waterTexture})
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.receiveShadow = true
water.position.y = 0
scene.add(water)

// Adiciona o céu como esfera
const skyGeometry = new THREE.SphereGeometry( 300, 32, 16 );
const skyTexture = textureLoader.load('./textures/sky.jpeg')
skyTexture.wrapS = skyTexture.wrapT = THREE.RepeatWrapping
skyTexture.repeat = new THREE.Vector2(1, 1)
const skyMaterial = new THREE.MeshBasicMaterial({map: skyTexture, side: THREE.BackSide})
const sky = new THREE.Mesh(skyGeometry, skyMaterial)
sky.rotation.y = 100
scene.add(sky)

// Adiciona modelo de ilha
let island
modelLoader.load('./models/island/scene.gltf', gltf => {
  island = gltf.scene
  scene.add(island)
  island.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new THREE.MeshPhongMaterial({map: texture})
      o.castShadow = true
      o.receiveShadow = true
    }
  })

  island.scale.set(7, 7, 7)
  island.position.y = -51.5
  island.position.z = 20
  island.position.x = 50
  island.rotation.y = 90

}, undefined, error => {
  console.error(error)
})

// Adiciona modelo do Grogu
let grogu
modelLoader.load('./models/grogu/scene.gltf', gltf => {
  grogu = gltf.scene
  grogu.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new THREE.MeshPhongMaterial({map: texture})
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  grogu.scale.set(3, 3, 3)
  grogu.position.set(14, 29, -6)
  grogu.rotation.y = -45.5
  scene.add(grogu)
}, undefined, error => {
  console.error(error)
})

// Adiciona modelo de pedra
let stone1
modelLoader.load('./models/stone/scene.gltf', gltf => {
  stone1 = gltf.scene
  stone1.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new THREE.MeshPhongMaterial({map: texture})
      o.castShadow = true
      o.receiveShadow = true
    }
  })

  stone1.scale.set(3, 3, 3)
  stone1.position.set(18, 24, -8)
  scene.add(stone1)

}, undefined, error => {
  console.error(error)
})

// Adiciona modelo de pedra
let stone2
modelLoader.load('./models/stone/scene.gltf', gltf => {
  stone2 = gltf.scene
  stone2.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new THREE.MeshPhongMaterial({map: texture})
      o.castShadow = true
      o.receiveShadow = true
    }
  })

  stone2.scale.set(2, 2, 2)
  stone2.position.set(-18, 34, 8)
  stone2.rotation.x = 30
  scene.add(stone2)

}, undefined, error => {
  console.error(error)
})

// Adiciona modelo de pedra
let stone3
modelLoader.load('./models/stone/scene.gltf', gltf => {
  stone3 = gltf.scene
  stone3.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new THREE.MeshPhongMaterial({map: texture})
      o.castShadow = true
      o.receiveShadow = true
    }
  })

  stone3.scale.set(2.25, 2.25, 2.25)
  stone3.position.set(-18, 30, 8)
  stone3.rotation.x = 30
  scene.add(stone3)

}, undefined, error => {
  console.error(error)
})

let stoneArray
modelLoader.load('./models/stone_array/scene.gltf', gltf => {
  stoneArray = gltf.scene
  scene.add(stoneArray)
  stoneArray.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new THREE.MeshPhongMaterial({map: texture})
      o.castShadow = true
      o.receiveShadow = true
    }
  })

  stoneArray.scale.set(25, 25, 25)
  stoneArray.position.y = 15
  stoneArray.rotation.y = 90.5

}, undefined, error => {
  console.error(error)
})

// Posicionamento da câmera
camera.position.x = -150
camera.position.z = 100
camera.position.y = 55

// Configuração para animação
let speedLight = 0
let speedWater = 0

// Função para fazer objeto orbitar
var orbitObject = function (object, orbiter, speed, distance) {
  var time = Date.now();
  orbiter.position.x = Math.cos(time * speed / 1000) * distance + object.position.x - 15;
  orbiter.position.z = Math.sin(time * speed / 1000) * distance + object.position.z + 8;
}

// Animações
function animate() {
  speedLight += 0.005
  speedWater += 0.02
	requestAnimationFrame( animate )

  // Subir e descer da água
  water.position.y = 0 + Math.sin(speedWater) * 0.5
  waterTexture.offset = new THREE.Vector2(Math.sin(speedWater*0.05)/2 + 0.5, 0)

  // Rotação do céu
  sky.rotation.y += 0.0005

  // Pedras orbitando ao redor do Grogu
  orbitObject(grogu, stone3, 1.5, 15)
  stone3.rotation.y += 0.02
  orbitObject(grogu, stone2, 2, 15)
  stone2.rotation.y += 0.02
  orbitObject(grogu, stone1, 1, 25)
  stone1.rotation.y += 0.02

  // Luz transladando e acompanhando o sol
  light.position.x = 250*Math.sin(speedLight*0.1)
  light.position.z = 250*Math.cos(speedLight*0.1)

	renderer.render( scene, camera )
  controls.update()
}
animate()