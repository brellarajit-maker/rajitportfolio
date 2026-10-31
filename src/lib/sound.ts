/**
 * Tiny synthesised UI sounds — no audio files to download. Off until the
 * visitor turns it on, and the choice is remembered.
 */

const KEY = "rb-sound"
let ctx: AudioContext | null = null
let on = false

export function restoreSound() {
  try {
    on = localStorage.getItem(KEY) === "on"
  } catch {
    on = false
  }
  return on
}

export function setSound(next: boolean) {
  on = next
  try {
    localStorage.setItem(KEY, next ? "on" : "off")
  } catch {
    /* private mode: the session still works, the choice just is not kept */
  }
  window.dispatchEvent(new Event("rb-sound-change"))
  if (next) blip(880, 0.05, 0.02)
}

export function blip(freq = 620, duration = 0.05, gain = 0.025) {
  if (!on) return
  try {
    ctx ??= new AudioContext()
    if (ctx.state === "suspended") void ctx.resume()
    const osc = ctx.createOscillator()
    const amp = ctx.createGain()
    osc.type = "sine"
    osc.frequency.value = freq
    amp.gain.setValueAtTime(0, ctx.currentTime)
    amp.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.008)
    amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.connect(amp).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {
    /* audio is a nicety; never let it break a click */
  }
}
