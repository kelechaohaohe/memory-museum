## Inspiration
Physical keepsakes hold onto memories in a way digital ones don't, a record, a photo, a letter each carry a specific feeling before you even look closely at them. We wanted a website that captured that: not a gallery you scroll past, but a desk you sit down at, where picking something up is the whole experience. That became Memory Museum, a 3D desk scene where four ordinary objects each hide a different memory, waiting to be opened.

## What it does
Memory Museum opens on a warm, lamp-lit desk with four objects sitting on it: a vinyl record, a book, a letter, and a picture frame. Hovering an object gives it a soft glow. Clicking it sends the camera diving in toward it, and the object transforms into its own animated memory scene, each with a completely different visual language:

- The **record** sends sentences rippling outward in a wavy animation as it plays.
- The **picture frame** becomes a 3D Polaroid camera that physically prints out polaroid cards, each carrying a piece of the story.
- The **book** flips open to reveal its pages.
- The **letter** unfolds from its envelope.

Each memory can be exited to return to the desk, and URL routing means any memory can be linked to and loaded directly.

## How we built it
The stack is React Three Fiber on top of Three.js, with `drei` for helpers, GSAP for the camera and transition animations, Zustand for shared state, and React Router for URL-based navigation between memories.

The architecture centers on one idea: the desk and the memory scenes never talk to each other directly. A Zustand store (`useMemoryStore`) holds which memory is active and whether a transition is in flight; everything else like hover glow, the camera dive, which memory component renders, just reacts to that store. A `CameraRig` component owns all camera movement through three phases (idle parallax, diving in, settled on the object) and drives the dive with GSAP, hard-setting the final `lookAt` on completion so the framing never drifts. A shared `MEMORY_CONFIG` file holds every object's desk position and camera target, so the numbers live in exactly one place. Each memory scene got its own transition treatment rather than one shared effect, a white fade for the record, a flip transition elsewhere, so the four still feel like distinct objects rather than the same effect re-skinned.

## Challenges we ran into
The camera transition was the trickiest system to get reliable. Early on, a `setTimeout` in the app and GSAP's own `onComplete` callback were both trying to clear the "transitioning" flag, which caused race conditions where the UI would unlock before the camera had actually finished moving. Fixing it meant making `onComplete` the single source of truth.

Getting effects to stay independent per scene was a constant discipline problem, it's easy to reuse a blur or a light rig from one memory in another and end up with everything looking the same. We had to keep pulling things back apart so the record, book, letter, and picture frame each kept their own visual identity.

Smaller but real bugs along the way: bloom post-processing blowing out into a blinding glow until we switched materials and retuned the luminance threshold; Polaroid cards rendering behind the camera body until their z-position was nudged forward; and a `Billboard` wrapper silently breaking ref updates on its children until the ref was moved to the inner group.

## Accomplishments that we're proud of
Getting four genuinely different interactive moments to live inside one coherent scene, without the transitions or effects blurring together, is the thing we're most proud of, especially the Polaroid camera, which prints physical-feeling cards rather than just fading in an image. We're also proud of how solid the underlying camera and state system ended up: once the dive-in loop was proven on one object, adding the rest was mostly just writing new scenes, not fighting the framework.

## What we learned
We learned to treat the camera and transition state as a small state machine instead of a pile of flags, naming the phases explicitly (idle, diving, settled) made a whole category of race-condition bugs disappear. We also learned the value of a single tuning knob over scattered constants: collapsing scaling or spacing logic into one multiplier saved real debugging time later. And we got a much better feel for the specific footguns of React Three Fiber. Suspense boundaries that can take down sibling components, and component wrappers like `Billboard` that can quietly break refs.

## Built With
- JavaScript (JSX)
- React
- Three.js
- React Three Fiber
- drei
- @react-three/postprocessing
- GSAP
- Zustand
- React Router
- Howler.js
- Vite
- GitHub Pages (hosting)

## What's next for Memory Museum
Next up is resolving the remaining polish items: fixing word spacing and centering in the record scene, tracking down a material-tinting issue on the book's 3D model, and finishing the letter's unfold orientation. Beyond that, we'd like to add an order-dependent twist where clicking the objects in a specific sequence reveals something extra, bring proper touch support for mobile, and add subtle environmental atmosphere by shifting window light, ambient rain to make the desk feel even more alive.