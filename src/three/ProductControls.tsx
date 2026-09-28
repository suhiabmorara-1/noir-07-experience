import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useRef, type MutableRefObject, type PropsWithChildren } from 'react'
import { Group, MathUtils } from 'three'

export type ProductInteractionState = 'idle' | 'hover' | 'dragging'

interface ProductControlsProps extends PropsWithChildren {
  mouse: MutableRefObject<{ x: number; y: number }>
  mobile?: boolean
  reducedMotion?: boolean
  onInteractionChange?: (state: ProductInteractionState) => void
}

interface DragState {
  pointerId: number | null
  pending: boolean
  dragging: boolean
  touch: boolean
  startX: number
  startY: number
  lastX: number
  lastY: number
  lastTime: number
}

interface PointerCaptureTarget {
  setPointerCapture: (pointerId: number) => void
  releasePointerCapture: (pointerId: number) => void
}

const X_LIMIT = 0.65
const TOUCH_INTENT_THRESHOLD = 9
const DESKTOP_SENSITIVITY = 0.0062
const TOUCH_SENSITIVITY = 0.0072
const MAX_VELOCITY_X = 1.65
const MAX_VELOCITY_Y = 2.8

export function ProductControls({
  children,
  mouse,
  mobile = false,
  reducedMotion = false,
  onInteractionChange,
}: ProductControlsProps) {
  const rotationGroup = useRef<Group>(null)
  const targetRotation = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const hovered = useRef(false)
  const drag = useRef<DragState>({
    pointerId: null,
    pending: false,
    dragging: false,
    touch: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
  })

  useEffect(() => () => onInteractionChange?.('idle'), [onInteractionChange])

  const setInteraction = (state: ProductInteractionState) => {
    onInteractionChange?.(state)
  }

  const capturePointer = (event: ThreeEvent<PointerEvent>) => {
    try {
      ;(event.target as unknown as PointerCaptureTarget).setPointerCapture(event.pointerId)
    } catch {
      // R3F can still deliver the current event even when capture is unavailable.
    }
  }

  const releasePointer = (event: ThreeEvent<PointerEvent>) => {
    try {
      ;(event.target as unknown as PointerCaptureTarget).releasePointerCapture(event.pointerId)
    } catch {
      // The browser may have released capture already after pointercancel.
    }
  }

  const beginDrag = (event: ThreeEvent<PointerEvent>) => {
    drag.current.dragging = true
    drag.current.pending = false
    drag.current.lastX = event.clientX
    drag.current.lastY = event.clientY
    drag.current.lastTime = event.timeStamp
    velocity.current.x = 0
    velocity.current.y = 0
    capturePointer(event)
    setInteraction('dragging')
  }

  const onPointerEnter = (event: ThreeEvent<PointerEvent>) => {
    if (event.pointerType === 'touch') return
    hovered.current = true
    if (!drag.current.dragging) setInteraction('hover')
  }

  const onPointerLeave = (event: ThreeEvent<PointerEvent>) => {
    if (event.pointerType === 'touch') return
    hovered.current = false
    if (!drag.current.dragging) setInteraction('idle')
  }

  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!event.isPrimary) return

    const isTouch = event.pointerType === 'touch'
    drag.current = {
      pointerId: event.pointerId,
      pending: isTouch,
      dragging: false,
      touch: isTouch,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: event.timeStamp,
    }

    if (!isTouch) {
      event.stopPropagation()
      beginDrag(event)
    }
  }

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    const state = drag.current
    if (state.pointerId !== event.pointerId) return

    if (state.pending && state.touch) {
      const totalX = event.clientX - state.startX
      const totalY = event.clientY - state.startY
      const absX = Math.abs(totalX)
      const absY = Math.abs(totalY)

      if (Math.max(absX, absY) < TOUCH_INTENT_THRESHOLD) return

      if (absX > absY * 1.15) {
        beginDrag(event)
      } else {
        // A vertical gesture belongs to the page. Do not capture or cancel it.
        state.pending = false
        state.pointerId = null
        return
      }
    }

    if (!state.dragging) return

    event.stopPropagation()
    event.nativeEvent.preventDefault()

    const sensitivity = mobile || state.touch ? TOUCH_SENSITIVITY : DESKTOP_SENSITIVITY
    const deltaX = event.clientX - state.lastX
    const deltaY = event.clientY - state.lastY
    const elapsed = Math.max((event.timeStamp - state.lastTime) / 1000, 1 / 120)
    const rotationDeltaX = deltaY * sensitivity
    const rotationDeltaY = deltaX * sensitivity

    targetRotation.current.x = MathUtils.clamp(
      targetRotation.current.x + rotationDeltaX,
      -X_LIMIT,
      X_LIMIT,
    )
    targetRotation.current.y += rotationDeltaY

    velocity.current.x = MathUtils.lerp(
      velocity.current.x,
      MathUtils.clamp(rotationDeltaX / elapsed, -MAX_VELOCITY_X, MAX_VELOCITY_X),
      0.42,
    )
    velocity.current.y = MathUtils.lerp(
      velocity.current.y,
      MathUtils.clamp(rotationDeltaY / elapsed, -MAX_VELOCITY_Y, MAX_VELOCITY_Y),
      0.42,
    )

    state.lastX = event.clientX
    state.lastY = event.clientY
    state.lastTime = event.timeStamp
  }

  const finishInteraction = (event: ThreeEvent<PointerEvent>, cancelled = false) => {
    const state = drag.current
    if (state.pointerId !== event.pointerId) return

    if (state.dragging) releasePointer(event)
    if (cancelled || reducedMotion) {
      velocity.current.x = 0
      velocity.current.y = 0
    }

    state.pointerId = null
    state.pending = false
    state.dragging = false
    setInteraction(hovered.current && event.pointerType !== 'touch' ? 'hover' : 'idle')
  }

  useFrame((_, delta) => {
    const state = drag.current

    if (!state.dragging) {
      targetRotation.current.x += velocity.current.x * delta
      targetRotation.current.y += velocity.current.y * delta

      const clampedX = MathUtils.clamp(targetRotation.current.x, -X_LIMIT, X_LIMIT)
      if (clampedX !== targetRotation.current.x) velocity.current.x = 0
      targetRotation.current.x = clampedX

      const inertiaDamping = reducedMotion ? 13 : 3.45
      velocity.current.x = MathUtils.damp(velocity.current.x, 0, inertiaDamping, delta)
      velocity.current.y = MathUtils.damp(velocity.current.y, 0, inertiaDamping, delta)
    }

    if (!rotationGroup.current) return

    const allowHover = hovered.current && !state.dragging && !reducedMotion && !mobile
    const hoverX = allowHover ? -mouse.current.y * 0.025 : 0
    const hoverY = allowHover ? mouse.current.x * 0.032 : 0
    const desiredX = MathUtils.clamp(targetRotation.current.x + hoverX, -X_LIMIT, X_LIMIT)
    const desiredY = targetRotation.current.y + hoverY
    const response = reducedMotion ? 14 : 7.2

    rotationGroup.current.rotation.x = MathUtils.damp(
      rotationGroup.current.rotation.x,
      desiredX,
      response,
      delta,
    )
    rotationGroup.current.rotation.y = MathUtils.damp(
      rotationGroup.current.rotation.y,
      desiredY,
      response,
      delta,
    )
  })

  return (
    <group ref={rotationGroup} name="UserRotationGroup">
      {children}
      <mesh
        name="ProductInteractionHitbox"
        position={[0, 0.62, 0]}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => finishInteraction(event)}
        onPointerCancel={(event) => finishInteraction(event, true)}
      >
        <boxGeometry args={[3.3, 6.35, 2.2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
    </group>
  )
}
