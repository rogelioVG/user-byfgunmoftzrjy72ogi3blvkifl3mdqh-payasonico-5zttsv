import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const app = document.querySelector('#app')

app.innerHTML = `
  <canvas id="wedding-canvas"></canvas>
  <section class="hud">
    <div class="hud__header">
      <h1>El Payaso del Rodeo</h1>
      <p class="status" data-status>¡Baila al mismo ritmo!</p>
    </div>
    <div class="game-stats">
      <div class="stat">
        <span class="stat-label">Vidas:</span>
        <span class="stat-value" id="lives">6</span>
      </div>
      <div class="stat">
        <span class="stat-label">Ritmo:</span>
        <span class="stat-value" id="rhythm">0%</span>
      </div>
      <div class="stat">
        <span class="stat-label">Puntuación:</span>
        <span class="stat-value" id="score">0</span>
      </div>
    </div>
    <p data-tip>¡Baila al mismo ritmo que los demás! Usa WASD para moverte y evita que te pisen.</p>
    <ul class="actions">
      <li><strong>W/A/S/D</strong> Mover jugador</li>
      <li><strong>Mouse</strong> Rotar cámara</li>
      <li><strong>Rueda</strong> Acercar/Alejar</li>
    </ul>
  </section>
`

const canvas = document.getElementById('wedding-canvas')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a0f0a)
scene.fog = new THREE.Fog(0x1a0f0a, 30, 80)

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  200
)
camera.position.set(15, 12, 15)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 3, 0)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 1.8
controls.minDistance = 5
controls.maxDistance = 40

// Iluminación cálida para el salón
const ambientLight = new THREE.AmbientLight(0xfff5e1, 0.4)
scene.add(ambientLight)

// Luces principales del salón
const mainLight = new THREE.DirectionalLight(0xfff5e1, 0.8)
mainLight.position.set(0, 15, 0)
mainLight.castShadow = true
mainLight.shadow.mapSize.set(2048, 2048)
mainLight.shadow.camera.left = -25
mainLight.shadow.camera.right = 25
mainLight.shadow.camera.top = 25
mainLight.shadow.camera.bottom = -25
mainLight.shadow.camera.near = 0.1
mainLight.shadow.camera.far = 50
scene.add(mainLight)

// Luces de color para ambiente festivo
const redLight = new THREE.PointLight(0xff4444, 0.6, 20)
redLight.position.set(-8, 8, -8)
scene.add(redLight)

const greenLight = new THREE.PointLight(0x44ff44, 0.6, 20)
greenLight.position.set(8, 8, 8)
scene.add(greenLight)

const whiteLight = new THREE.PointLight(0xffffff, 0.8, 15)
whiteLight.position.set(0, 10, 0)
scene.add(whiteLight)

// Crear el salón de eventos
const hallSize = 40
const wallHeight = 12
const wallThickness = 0.5

// Piso del salón
const floorMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x3a2a1f,
  roughness: 0.7,
  metalness: 0.1
})
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(hallSize, hallSize),
  floorMaterial
)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

// Pista de baile central (ampliada para el juego)
const danceFloorSize = 20  // Ampliada de 12 a 20
const danceFloorMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x2a1a0f,
  roughness: 0.3,
  metalness: 0.2
})
const danceFloor = new THREE.Mesh(
  new THREE.CircleGeometry(danceFloorSize / 2, 32),
  danceFloorMaterial
)
danceFloor.rotation.x = -Math.PI / 2
danceFloor.position.y = 0.01
danceFloor.receiveShadow = true
scene.add(danceFloor)

// Paredes del salón
const wallMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xf5e6d3,
  roughness: 0.8
})

// Pared frontal (donde está el escenario)
const frontWall = new THREE.Mesh(
  new THREE.BoxGeometry(hallSize, wallHeight, wallThickness),
  wallMaterial
)
frontWall.position.set(0, wallHeight / 2, -hallSize / 2)
frontWall.receiveShadow = true
scene.add(frontWall)

// Pared trasera
const backWall = new THREE.Mesh(
  new THREE.BoxGeometry(hallSize, wallHeight, wallThickness),
  wallMaterial
)
backWall.position.set(0, wallHeight / 2, hallSize / 2)
backWall.receiveShadow = true
scene.add(backWall)

// Pared izquierda
const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, wallHeight, hallSize),
  wallMaterial
)
leftWall.position.set(-hallSize / 2, wallHeight / 2, 0)
leftWall.receiveShadow = true
scene.add(leftWall)

// Pared derecha
const rightWall = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, wallHeight, hallSize),
  wallMaterial
)
rightWall.position.set(hallSize / 2, wallHeight / 2, 0)
rightWall.receiveShadow = true
scene.add(rightWall)

// Techo
const ceilingMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xe8dcc8,
  roughness: 0.9
})
const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(hallSize, hallSize),
  ceilingMaterial
)
ceiling.rotation.x = Math.PI / 2
ceiling.position.y = wallHeight
ceiling.receiveShadow = true
scene.add(ceiling)

// Escenario para el grupo versátil (frente a la pista de baile)
const stageWidth = 8
const stageDepth = 3
const stageHeight = 0.3
const stageMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x8b4513,
  roughness: 0.6
})

const stage = new THREE.Mesh(
  new THREE.BoxGeometry(stageWidth, stageHeight, stageDepth),
  stageMaterial
)
stage.position.set(0, stageHeight / 2, -danceFloorSize / 2 - stageDepth / 2 - 2)
stage.castShadow = true
stage.receiveShadow = true
scene.add(stage)

// Borde del escenario
const stageBorder = new THREE.Mesh(
  new THREE.BoxGeometry(stageWidth + 0.2, 0.1, stageDepth + 0.2),
  new THREE.MeshStandardMaterial({ color: 0x654321 })
)
stageBorder.position.set(0, stageHeight + 0.05, stage.position.z)
scene.add(stageBorder)

// Crear grupo versátil (músicos)
const createMusician = (x, instrumentColor = 0x4a4a4a) => {
  const group = new THREE.Group()
  
  // Cuerpo
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 1.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x2c2c2c })
  )
  body.position.y = 0.6
  body.castShadow = true
  group.add(body)
  
  // Cabeza
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffdbac })
  )
  head.position.y = 1.5
  head.castShadow = true
  group.add(head)
  
  // Instrumento (guitarra o teclado)
  const instrument = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.05, 0.3),
    new THREE.MeshStandardMaterial({ color: instrumentColor })
  )
  instrument.position.set(0.4, 0.8, 0)
  instrument.castShadow = true
  group.add(instrument)
  
  group.position.set(x, stageHeight, stage.position.z)
  return group
}

// Crear varios músicos
const musicians = []
const musicianPositions = [-2.5, -0.8, 0.8, 2.5]
const instrumentColors = [0x8b4513, 0x2c2c2c, 0x654321, 0x4a4a4a]

musicianPositions.forEach((x, i) => {
  const musician = createMusician(x, instrumentColors[i])
  musicians.push(musician)
  scene.add(musician)
})

// Micrófonos en el escenario
const createMicrophone = (x) => {
  const micGroup = new THREE.Group()
  
  const stand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  )
  stand.position.y = 0.75
  micGroup.add(stand)
  
  const mic = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
  )
  mic.position.y = 1.5
  micGroup.add(mic)
  
  micGroup.position.set(x, stageHeight, stage.position.z - 0.5)
  return micGroup
}

const mic1 = createMicrophone(-1.2)
const mic2 = createMicrophone(1.2)
scene.add(mic1)
scene.add(mic2)

// Altavoces en el escenario
const createSpeaker = (x, side) => {
  const speaker = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.2, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
  )
  speaker.position.set(x, stageHeight + 0.6, stage.position.z + side * 0.3)
  speaker.castShadow = true
  return speaker
}

scene.add(createSpeaker(-3.5, -1))
scene.add(createSpeaker(3.5, -1))

// Mesas alrededor de la pista de baile
const createTable = (x, z) => {
  const tableGroup = new THREE.Group()
  
  // Mesa
  const tableTop = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.2, 0.05, 16),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  )
  tableTop.position.y = 0.75
  tableTop.castShadow = true
  tableTop.receiveShadow = true
  tableGroup.add(tableTop)
  
  // Base de la mesa
  const tableBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.2, 0.7, 8),
    new THREE.MeshStandardMaterial({ color: 0x654321 })
  )
  tableBase.position.y = 0.35
  tableBase.castShadow = true
  tableGroup.add(tableBase)
  
  // Mantel decorativo (colores mexicanos)
  const tablecloth = new THREE.Mesh(
    new THREE.CylinderGeometry(1.3, 1.3, 0.02, 16),
    new THREE.MeshStandardMaterial({ 
      color: Math.random() > 0.5 ? 0xff0000 : 0x00ff00,
      roughness: 0.9
    })
  )
  tablecloth.position.y = 0.72
  tableGroup.add(tablecloth)
  
  // Centro de mesa (flores)
  const centerpiece = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 0.3, 8),
    new THREE.MeshStandardMaterial({ color: 0xffd700 })
  )
  centerpiece.position.y = 0.9
  centerpiece.castShadow = true
  tableGroup.add(centerpiece)
  
  // Pétalos de flores
  for (let i = 0; i < 6; i++) {
    const petal = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshStandardMaterial({ 
        color: Math.random() > 0.5 ? 0xff1493 : 0xff6347 
      })
    )
    const angle = (i / 6) * Math.PI * 2
    petal.position.set(
      Math.cos(angle) * 0.2,
      0.95,
      Math.sin(angle) * 0.2
    )
    tableGroup.add(petal)
  }
  
  tableGroup.position.set(x, 0, z)
  return tableGroup
}

// Crear mesas alrededor de la pista
const tablePositions = [
  [-8, 6], [0, 6], [8, 6],
  [-8, -6], [0, -6], [8, -6],
  [-10, 0], [10, 0]
]

tablePositions.forEach(([x, z]) => {
  const table = createTable(x, z)
  scene.add(table)
})

// Sillas alrededor de las mesas
const createChair = (x, z, rotation) => {
  const chairGroup = new THREE.Group()
  
  // Asiento
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.1, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x654321 })
  )
  seat.position.y = 0.4
  seat.castShadow = true
  chairGroup.add(seat)
  
  // Respaldo
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.6, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x654321 })
  )
  back.position.set(0, 0.7, -0.2)
  back.castShadow = true
  chairGroup.add(back)
  
  // Patas
  const legGeometry = new THREE.BoxGeometry(0.05, 0.4, 0.05)
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2f1b })
  const legPositions = [
    [-0.2, 0.2, -0.2],
    [0.2, 0.2, -0.2],
    [-0.2, 0.2, 0.2],
    [0.2, 0.2, 0.2]
  ]
  
  legPositions.forEach(([px, py, pz]) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial)
    leg.position.set(px, py, pz)
    leg.castShadow = true
    chairGroup.add(leg)
  })
  
  chairGroup.position.set(x, 0, z)
  chairGroup.rotation.y = rotation
  return chairGroup
}

// Agregar sillas alrededor de cada mesa
tablePositions.forEach(([tx, tz]) => {
  const angles = [0, Math.PI / 2, Math.PI, -Math.PI / 2]
  angles.forEach((angle, i) => {
    const distance = 1.5
    const chairX = tx + Math.cos(angle) * distance
    const chairZ = tz + Math.sin(angle) * distance
    const chair = createChair(chairX, chairZ, angle + Math.PI)
    scene.add(chair)
  })
})

// Decoraciones de papel picado (banderines mexicanos)
const createPapelPicado = (startX, endX, y, z, color) => {
  const group = new THREE.Group()
  const count = 8
  const step = (endX - startX) / count
  
  for (let i = 0; i < count; i++) {
    const x = startX + i * step
    const flag = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 0.6),
      new THREE.MeshStandardMaterial({ 
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      })
    )
    flag.position.set(x, y, z)
    flag.rotation.y = Math.PI / 2
    group.add(flag)
  }
  
  return group
}

// Papel picado en colores mexicanos (verde, blanco, rojo)
const papelPicado1 = createPapelPicado(-hallSize/2 + 2, hallSize/2 - 2, 9, -hallSize/2 + 1, 0xff0000)
scene.add(papelPicado1)

const papelPicado2 = createPapelPicado(-hallSize/2 + 2, hallSize/2 - 2, 8.5, -hallSize/2 + 1, 0xffffff)
scene.add(papelPicado2)

const papelPicado3 = createPapelPicado(-hallSize/2 + 2, hallSize/2 - 2, 8, -hallSize/2 + 1, 0x00ff00)
scene.add(papelPicado3)

// Luces decorativas colgantes
const createHangingLight = (x, z, color) => {
  const group = new THREE.Group()
  
  // Cable
  const cable = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 2, 8),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  )
  cable.position.y = wallHeight - 1
  group.add(cable)
  
  // Lámpara
  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 16, 16),
    new THREE.MeshStandardMaterial({ 
      color: color,
      emissive: color,
      emissiveIntensity: 0.5
    })
  )
  lamp.position.y = wallHeight - 2
  group.add(lamp)
  
  // Luz puntual
  const light = new THREE.PointLight(color, 0.5, 5)
  light.position.set(0, wallHeight - 2, 0)
  group.add(light)
  
  group.position.set(x, 0, z)
  return group
}

// Luces decorativas alrededor del salón
const lightPositions = [
  [-12, -12, 0xff4444],
  [12, -12, 0x44ff44],
  [-12, 12, 0xffff44],
  [12, 12, 0xff44ff],
  [0, -15, 0xffffff]
]

lightPositions.forEach(([x, z, color]) => {
  const light = createHangingLight(x, z, color)
  scene.add(light)
})

// Arreglos florales en las esquinas
const createFlowerArrangement = (x, z) => {
  const group = new THREE.Group()
  
  // Maceta
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.25, 0.4, 16),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  )
  pot.position.y = 0.2
  group.add(pot)
  
  // Tallos y flores
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x228b22 })
    )
    stem.position.set(
      Math.cos(angle) * 0.15,
      0.6,
      Math.sin(angle) * 0.15
    )
    group.add(stem)
    
    // Flor
    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshStandardMaterial({ 
        color: Math.random() > 0.5 ? 0xff1493 : 0xff6347 
      })
    )
    flower.position.set(
      Math.cos(angle) * 0.15,
      1.0,
      Math.sin(angle) * 0.15
    )
    group.add(flower)
  }
  
  group.position.set(x, 0, z)
  return group
}

// Arreglos florales en las esquinas del salón
const flowerPositions = [
  [-hallSize/2 + 1, -hallSize/2 + 1],
  [hallSize/2 - 1, -hallSize/2 + 1],
  [-hallSize/2 + 1, hallSize/2 - 1],
  [hallSize/2 - 1, hallSize/2 - 1]
]

flowerPositions.forEach(([x, z]) => {
  const flowers = createFlowerArrangement(x, z)
  scene.add(flowers)
})

// ========== SISTEMA DE JUEGO ==========

// Estado del juego
let gameState = {
  lives: 6,
  score: 0,
  rhythm: 0,
  gameOver: false
}

// Actualizar HUD
const updateHUD = () => {
  document.getElementById('lives').textContent = gameState.lives
  document.getElementById('rhythm').textContent = Math.round(gameState.rhythm) + '%'
  document.getElementById('score').textContent = Math.floor(gameState.score)
}

// Crear personaje (jugador)
const createPlayer = () => {
  const playerGroup = new THREE.Group()
  
  // Cuerpo
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 1, 8),
    new THREE.MeshStandardMaterial({ color: 0xff0000 }) // Rojo para destacar
  )
  body.position.y = 0.5
  body.castShadow = true
  playerGroup.add(body)
  
  // Cabeza
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffdbac })
  )
  head.position.y = 1.2
  head.castShadow = true
  playerGroup.add(head)
  
  // Sombrero de payaso
  const hat = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.4, 8),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
  )
  hat.position.y = 1.5
  playerGroup.add(hat)
  
  // Brazos
  const leftArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8),
    new THREE.MeshStandardMaterial({ color: 0xffdbac })
  )
  leftArm.position.set(-0.3, 0.7, 0)
  leftArm.rotation.z = Math.PI / 4
  playerGroup.add(leftArm)
  
  const rightArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8),
    new THREE.MeshStandardMaterial({ color: 0xffdbac })
  )
  rightArm.position.set(0.3, 0.7, 0)
  rightArm.rotation.z = -Math.PI / 4
  playerGroup.add(rightArm)
  
  // Piernas
  const leftLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8),
    new THREE.MeshStandardMaterial({ color: 0x0000ff })
  )
  leftLeg.position.set(-0.15, 0, 0)
  leftLeg.castShadow = true
  playerGroup.add(leftLeg)
  
  const rightLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8),
    new THREE.MeshStandardMaterial({ color: 0x0000ff })
  )
  rightLeg.position.set(0.15, 0, 0)
  rightLeg.castShadow = true
  playerGroup.add(rightLeg)
  
  playerGroup.position.set(0, 0, 0)
  
  // Agregar userData para animación
  playerGroup.userData = {
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    body,
    head,
    phase: 0,
    speed: 1
  }
  
  return playerGroup
}

// Crear bailarín (NPC)
const createDancer = (age = 'adult', skinTone = 0xffdbac, clothingColor = 0x4a90e2) => {
  const dancerGroup = new THREE.Group()
  
  // Escalar según edad
  let scale = 1
  if (age === 'child') scale = 0.7
  if (age === 'elder') scale = 0.9
  
  // Cuerpo
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2 * scale, 0.2 * scale, 0.9 * scale, 8),
    new THREE.MeshStandardMaterial({ color: clothingColor })
  )
  body.position.y = 0.45 * scale
  body.castShadow = true
  dancerGroup.add(body)
  
  // Cabeza
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18 * scale, 16, 16),
    new THREE.MeshStandardMaterial({ color: skinTone })
  )
  head.position.y = 1.1 * scale
  head.castShadow = true
  dancerGroup.add(head)
  
  // Sombrero variado
  const hatTypes = ['none', 'cowboy', 'cap']
  const hatType = hatTypes[Math.floor(Math.random() * hatTypes.length)]
  
  if (hatType === 'cowboy') {
    const hat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25 * scale, 0.3 * scale, 0.2 * scale, 16),
      new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    )
    hat.position.y = 1.35 * scale
    dancerGroup.add(hat)
  } else if (hatType === 'cap') {
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.2 * scale, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
    )
    cap.position.y = 1.3 * scale
    cap.scale.y = 0.5
    dancerGroup.add(cap)
  }
  
  // Brazos
  const leftArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04 * scale, 0.04 * scale, 0.5 * scale, 8),
    new THREE.MeshStandardMaterial({ color: skinTone })
  )
  leftArm.position.set(-0.25 * scale, 0.6 * scale, 0)
  dancerGroup.add(leftArm)
  
  const rightArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04 * scale, 0.04 * scale, 0.5 * scale, 8),
    new THREE.MeshStandardMaterial({ color: skinTone })
  )
  rightArm.position.set(0.25 * scale, 0.6 * scale, 0)
  dancerGroup.add(rightArm)
  
  // Piernas
  const leftLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06 * scale, 0.06 * scale, 0.7 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x2c2c2c })
  )
  leftLeg.position.set(-0.1 * scale, 0, 0)
  leftLeg.castShadow = true
  dancerGroup.add(leftLeg)
  
  const rightLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06 * scale, 0.06 * scale, 0.7 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x2c2c2c })
  )
  rightLeg.position.set(0.1 * scale, 0, 0)
  rightLeg.castShadow = true
  dancerGroup.add(rightLeg)
  
  dancerGroup.scale.set(scale, scale, scale)
  dancerGroup.userData = {
    age,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    body,
    head,
    phase: Math.random() * Math.PI * 2, // Fase aleatoria para variación
    speed: 0.5 + Math.random() * 0.5, // Velocidad de baile variada
    moveAngle: Math.random() * Math.PI * 2, // Ángulo de movimiento
    moveSpeed: 0.02 + Math.random() * 0.03, // Velocidad de movimiento
    baseRadius: 3 + Math.random() * (danceFloorSize / 2 - 3) // Radio base
  }
  
  return dancerGroup
}

// Crear 30 bailarines organizados en 3 filas de 10
const dancers = []
const rows = 3
const dancersPerRow = 10
const skinTones = [0xffdbac, 0xf4c2a1, 0xd4a574, 0x8d5524, 0x654321]
const clothingColors = [0x4a90e2, 0xe24a4a, 0x4ae24a, 0xe2e24a, 0xe24ae2, 0x4ae2e2]
const ages = ['child', 'adult', 'elder']

// Espaciado entre bailarines
const rowSpacing = 2.5 // Distancia entre filas
const dancerSpacing = 1.5 // Distancia entre bailarines en la misma fila
const startX = -(dancersPerRow - 1) * dancerSpacing / 2 // Posición inicial X

// Crear bailarines en 3 filas
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < dancersPerRow; col++) {
    const age = ages[Math.floor(Math.random() * ages.length)]
    const skinTone = skinTones[Math.floor(Math.random() * skinTones.length)]
    const clothingColor = clothingColors[Math.floor(Math.random() * clothingColors.length)]
    
    const dancer = createDancer(age, skinTone, clothingColor)
    
    // Posicionar en fila
    const x = startX + col * dancerSpacing
    const z = (row - 1) * rowSpacing // Fila 0: arriba, Fila 1: medio, Fila 2: abajo
    
    dancer.position.set(x, 0, z)
    
    // Todos los bailarines tienen la misma fase inicial para estar sincronizados
    dancer.userData.phase = 0
    dancer.userData.speed = 1.0 // Misma velocidad para todos
    
    dancers.push(dancer)
    scene.add(dancer)
  }
}

// Crear jugador en la fila del medio (posición central)
const player = createPlayer()
const playerCol = 4.5 // Posición central en la fila (entre posición 4 y 5)
const playerRow = 1 // Fila del medio (0=arriba, 1=medio, 2=abajo)
player.position.set(startX + playerCol * dancerSpacing, 0, (playerRow - 1) * rowSpacing)
player.rotation.y = 0
scene.add(player)

// Inicializar HUD
updateHUD()

// Controles del jugador con WASD
const playerVelocity = new THREE.Vector3()
const playerSpeed = 0.2
const keys = {}

window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true
})

window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false
})

// Actualizar movimiento del jugador con WASD
const updatePlayerMovement = (delta) => {
  if (gameState.gameOver) return
  
  playerVelocity.set(0, 0, 0)
  
  // Controles WASD
  if (keys['w']) playerVelocity.z -= 1
  if (keys['s']) playerVelocity.z += 1
  if (keys['a']) playerVelocity.x -= 1
  if (keys['d']) playerVelocity.x += 1
  
  // Normalizar velocidad diagonal
  if (playerVelocity.length() > 0) {
    playerVelocity.normalize()
    playerVelocity.multiplyScalar(playerSpeed)
    
    // Calcular nueva posición
    const newX = player.position.x + playerVelocity.x * delta * 60
    const newZ = player.position.z + playerVelocity.z * delta * 60
    
    // Limitar movimiento dentro de la pista de baile
    const distanceFromCenter = Math.sqrt(newX * newX + newZ * newZ)
    const maxDistance = danceFloorSize / 2 - 0.5
    
    if (distanceFromCenter < maxDistance) {
      player.position.x = newX
      player.position.z = newZ
      
      // Rotar hacia la dirección de movimiento
      if (playerVelocity.length() > 0) {
        player.rotation.y = Math.atan2(playerVelocity.x, -playerVelocity.z)
      }
    }
  }
}

// Ritmo global sincronizado para todos los bailarines
let globalRhythmTime = 0
const rhythmSpeed = 1.5 // Velocidad del ritmo

// Animación del baile sincronizado
const animateSynchronizedDance = (dancer, time, delta, isPlayer = false) => {
  const { leftArm, rightArm, leftLeg, rightLeg, body, phase } = dancer.userData
  
  // Todos los bailarines usan el mismo tiempo de ritmo para estar sincronizados
  const danceTime = globalRhythmTime + phase
  
  // Movimiento de brazos sincronizado
  if (leftArm && rightArm) {
    leftArm.rotation.x = Math.sin(danceTime) * 0.6
    leftArm.rotation.z = Math.sin(danceTime * 1.1) * 0.4
    rightArm.rotation.x = -Math.sin(danceTime) * 0.6
    rightArm.rotation.z = -Math.sin(danceTime * 1.1) * 0.4
  }
  
  // Movimiento de piernas sincronizado (pasos de baile)
  if (leftLeg && rightLeg) {
    leftLeg.rotation.x = Math.sin(danceTime) * 0.4
    rightLeg.rotation.x = -Math.sin(danceTime) * 0.4
    
    // Levantamiento alternado de piernas (esto es lo que puede pisar al jugador)
    const leftLegLift = Math.max(0, Math.sin(danceTime) * 0.15)
    const rightLegLift = Math.max(0, -Math.sin(danceTime) * 0.15)
    leftLeg.position.y = leftLegLift
    rightLeg.position.y = rightLegLift
    
    // Guardar el estado de levantamiento para detección de colisiones
    // Una pierna está pisando cuando NO está levantada (y < 0.05)
    dancer.userData.leftLegLifted = leftLegLift > 0.05
    dancer.userData.rightLegLifted = rightLegLift > 0.05
  }
  
  // Movimiento del cuerpo (balanceo)
  if (body) {
    body.rotation.z = Math.sin(danceTime * 0.9) * 0.08
    body.rotation.x = Math.sin(danceTime * 0.7) * 0.04
  }
  
  // Movimiento vertical sutil (pasos)
  dancer.position.y = Math.abs(Math.sin(danceTime)) * 0.05
  
  // Los bailarines se mueven ligeramente en sus posiciones durante el baile
  if (!isPlayer) {
    const baseX = dancer.userData.baseX || dancer.position.x
    const baseZ = dancer.userData.baseZ || dancer.position.z
    
    // Guardar posición base si no existe
    if (!dancer.userData.baseX) {
      dancer.userData.baseX = baseX
      dancer.userData.baseZ = baseZ
    }
    
    // Movimiento lateral pequeño durante el baile
    const sideMovement = Math.sin(danceTime * 1.3) * 0.2
    dancer.position.x = baseX + sideMovement
    dancer.position.z = baseZ + Math.cos(danceTime * 1.1) * 0.15
  }
}

// Detección de colisiones (pisadas)
const checkCollisions = () => {
  if (gameState.gameOver) return
  
  const playerRadius = 0.4
  const dancerRadius = 0.35
  const stepRadius = 0.25 // Radio de la "pisada" cuando la pierna está abajo
  
  dancers.forEach((dancer) => {
    const distance = player.position.distanceTo(dancer.position)
    
    // Verificar si hay colisión general
    if (distance < playerRadius + dancerRadius) {
      // Verificar si el bailarín está pisando (pierna abajo)
      const isStepping = !dancer.userData.leftLegLifted || !dancer.userData.rightLegLifted
      
      if (isStepping) {
        // Calcular distancia a las piernas del bailarín
        const leftLegPos = new THREE.Vector3(
          dancer.position.x - 0.1,
          dancer.position.y,
          dancer.position.z
        )
        const rightLegPos = new THREE.Vector3(
          dancer.position.x + 0.1,
          dancer.position.y,
          dancer.position.z
        )
        
        const distToLeftLeg = player.position.distanceTo(leftLegPos)
        const distToRightLeg = player.position.distanceTo(rightLegPos)
        
        // Si el jugador está cerca de una pierna que está pisando
        if ((distToLeftLeg < stepRadius && !dancer.userData.leftLegLifted) ||
            (distToRightLeg < stepRadius && !dancer.userData.rightLegLifted)) {
          
          // Colisión detectada - perder vida
          if (!dancer.userData.hitCooldown || dancer.userData.hitCooldown < Date.now()) {
            gameState.lives--
            dancer.userData.hitCooldown = Date.now() + 1000 // Cooldown de 1 segundo
            updateHUD()
            
            // Feedback visual
            dancer.userData.body.material.emissive.setHex(0xff0000)
            dancer.userData.body.material.emissiveIntensity = 0.5
            setTimeout(() => {
              dancer.userData.body.material.emissive.setHex(0x000000)
              dancer.userData.body.material.emissiveIntensity = 0
            }, 200)
            
            if (gameState.lives <= 0) {
              gameState.gameOver = true
              document.querySelector('[data-status]').textContent = '¡Game Over! Presiona F5 para reiniciar'
            } else {
              document.querySelector('[data-status]').textContent = `¡Te pisaron! Vidas restantes: ${gameState.lives}`
              setTimeout(() => {
                document.querySelector('[data-status]').textContent = '¡Baila al mismo ritmo!'
              }, 2000)
            }
          }
        }
      }
    }
  })
}

// Sistema de ritmo
const updateRhythm = (time) => {
  if (gameState.gameOver) return
  
  // Actualizar tiempo de ritmo global
  globalRhythmTime = time * rhythmSpeed
  
  // Calcular qué tan sincronizado está el jugador con los demás
  // El jugador está sincronizado si se mueve al mismo ritmo
  const playerMovement = playerVelocity.length()
  const rhythmPhase = Math.sin(globalRhythmTime)
  
  // Si el jugador se está moviendo durante el ritmo correcto
  let syncScore = 0
  if (playerMovement > 0) {
    // Verificar si el movimiento coincide con el ritmo
    const movementPhase = Math.abs(rhythmPhase)
    syncScore = Math.min(1, movementPhase * 0.8 + 0.2) // Bonus por moverse durante el ritmo
  }
  
  gameState.rhythm = syncScore * 100
  
  // Aumentar puntuación si está sincronizado y no le pisan
  if (gameState.rhythm > 50) {
    gameState.score += 0.05
  }
  
  updateHUD()
}

// Animación de los músicos (movimiento sutil)
const clock = new THREE.Clock()

const animateMusicians = (delta) => {
  musicians.forEach((musician, index) => {
    // Movimiento sutil de balanceo al ritmo de la música
    const time = clock.getElapsedTime()
    musician.rotation.z = Math.sin(time * 2 + index) * 0.05
    musician.position.y = stageHeight + Math.sin(time * 3 + index) * 0.1
  })
}

// Animación de las luces (parpadeo suave)
const animateLights = (delta) => {
  const time = clock.getElapsedTime()
  
  // Hacer que las luces de color pulsen suavemente
  redLight.intensity = 0.4 + Math.sin(time * 2) * 0.2
  greenLight.intensity = 0.4 + Math.sin(time * 2 + Math.PI / 2) * 0.2
  whiteLight.intensity = 0.6 + Math.sin(time * 1.5) * 0.2
}

const animate = () => {
  const delta = clock.getDelta()
  const time = clock.getElapsedTime()
  requestAnimationFrame(animate)
  
  if (!gameState.gameOver) {
    // Actualizar movimiento del jugador con WASD
    updatePlayerMovement(delta)
    
    // Animar baile del jugador (sincronizado con el ritmo)
    animateSynchronizedDance(player, time, delta, true)
    
    // Animar todos los bailarines (sincronizados)
    dancers.forEach((dancer) => {
      animateSynchronizedDance(dancer, time, delta, false)
    })
    
    // Verificar colisiones
    checkCollisions()
    
    // Actualizar ritmo
    updateRhythm(time)
  }
  
  animateMusicians(delta)
  animateLights(delta)
  
  controls.update()
  renderer.render(scene, camera)
}

animate()

const handleResize = () => {
  const { innerWidth, innerHeight } = window
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
}

window.addEventListener('resize', handleResize)
