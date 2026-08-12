import sharp from 'sharp'

// The original scan is a watercolour painting on a white paper canvas.  Keep
// its actual pigment variation while turning only the paper-white pixels into
// transparency, so it can be layered over the ivory hero without a rectangle.
const source = await sharp('public/watercolor-sage.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { data, info } = source
const output = Buffer.alloc(data.length)

for (let index = 0; index < data.length; index += 4) {
  const red = data[index]
  const green = data[index + 1]
  const blue = data[index + 2]
  const darkness = 255 - Math.min(red, green, blue)
  const chroma = Math.max(red, green, blue) - Math.min(red, green, blue)
  // Paper stays invisible; gentle neutral pigment and coloured edges remain.
  const alpha = Math.max(0, Math.min(220, Math.round(darkness * 2.35 + chroma * 0.7 - 9)))

  output[index] = red
  output[index + 1] = green
  output[index + 2] = blue
  output[index + 3] = alpha
}

await sharp(output, { raw: info }).png({ compressionLevel: 9 }).toFile('public/watercolor-wash.png')

// A second, deliberately sage-forward pigment plate for the left portion of
// the composition. It uses exactly the scan's alpha and tonal variation—no
// CSS shape or smooth gradient—so its perimeter remains paint-like.
const sageOutput = Buffer.alloc(data.length)
for (let index = 0; index < data.length; index += 4) {
  const red = data[index]
  const green = data[index + 1]
  const blue = data[index + 2]
  const sourceAlpha = output[index + 3]
  const luminance = (red * 0.21 + green * 0.72 + blue * 0.07) / 255
  const shadow = (1 - luminance) * 34
  sageOutput[index] = Math.max(0, Math.round(164 - shadow * 1.1))
  sageOutput[index + 1] = Math.max(0, Math.round(181 - shadow * 0.72))
  sageOutput[index + 2] = Math.max(0, Math.round(157 - shadow * 0.9))
  sageOutput[index + 3] = Math.min(225, Math.round(sourceAlpha * 1.48))
}

await sharp(sageOutput, { raw: info }).png({ compressionLevel: 9 }).toFile('public/watercolor-sage-pigment.png')
console.log('Created transparent watercolour pigment plates')
