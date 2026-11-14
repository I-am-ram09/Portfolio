import { useReducer } from 'react'
import HeroHub from './components/HeroHub.jsx'
import ContentSpace from './components/ContentSpace.jsx'
import GlowCursor from './components/GlowCursor.jsx'
import CursorTrail from './components/CursorTrail.jsx'
import useMouse from './hooks/useMouse.js'

/**
 * State architecture
 *
 *   intro  --INTRO_DONE-->  idle  --AIM(target)-->  aiming  --FIRE-->  firing
 *   firing --IMPACT(point)--> impact --REVEAL--> content_view --RETURN--> returning --RESET--> idle
 *
 * Each transition is only legal from the phase before it, so a stray double click, a duplicate
 * callback (React StrictMode) or a mashed Esc key can never skip or repeat a stage.
 *
 *   phase    : where we are in the sequence
 *   target   : id of the clicked node ('about' | 'projects' | 'handles')
 *   point    : viewport {x, y} of the impact; the reveal grows out of it and the return shrinks into it
 *   shotId   : increments per shot so beam / impact components remount cleanly
 *
 * Who advances the phase:
 *   OrbitNode (last node entered)      -> INTRO_DONE
 *   OrbitNode click                    -> AIM
 *   AsciiCombatNav charge ring done    -> FIRE
 *   AsciiBeam head arrives             -> IMPACT
 *   ContentSpace circle fully open     -> REVEAL
 *   Back button / Esc                  -> RETURN
 *   ContentSpace circle fully closed   -> RESET
 */
const initial = { phase: 'intro', target: null, point: null, shotId: 0 }

function reducer(s, a) {
  switch (a.type) {
    case 'INTRO_DONE':
      return s.phase === 'intro' ? { ...s, phase: 'idle' } : s
    case 'AIM':
      return s.phase === 'idle' ? { ...s, phase: 'aiming', target: a.target, shotId: s.shotId + 1 } : s
    case 'FIRE':
      return s.phase === 'aiming' ? { ...s, phase: 'firing' } : s
    case 'IMPACT':
      return s.phase === 'firing' ? { ...s, phase: 'impact', point: a.point } : s
    case 'REVEAL':
      return s.phase === 'impact' ? { ...s, phase: 'content_view' } : s
    case 'RETURN':
      return s.phase === 'content_view' ? { ...s, phase: 'returning' } : s
    case 'RESET':
      return s.phase === 'returning' ? { ...s, phase: 'idle', target: null, point: null } : s
    default:
      return s
  }
}

export default function App() {
  const mouse = useMouse()
  const [state, dispatch] = useReducer(reducer, initial)
  const { phase, target, point, shotId } = state

  const spaceOpen = point && ['impact', 'content_view', 'returning'].includes(phase)

  return (
    <>
      <HeroHub phase={phase} target={target} shotId={shotId} point={point} dispatch={dispatch} mouse={mouse} />

      {spaceOpen && <ContentSpace key={shotId} id={target} point={point} phase={phase} dispatch={dispatch} />}

      <CursorTrail mouse={mouse} />
      <GlowCursor x={mouse.x} y={mouse.y} visible={mouse.visible} />
    </>
  )
}
