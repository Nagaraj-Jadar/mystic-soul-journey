import { removeBackground } from '@imgly/background-removal-node'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const inputPath = path.resolve('public/practitioner-photo.jpeg')
const outputPath = path.resolve('public/practitioner-cutout.png')

console.log('[v0] Reading input:', inputPath)
const buf = await readFile(inputPath)
const blob = new Blob([buf], { type: 'image/jpeg' })

console.log('[v0] Running background removal (this downloads a model on first run)...')
const resultBlob = await removeBackground(blob, {
  output: { format: 'image/png', quality: 0.9 },
})

const arrayBuffer = await resultBlob.arrayBuffer()
await writeFile(outputPath, Buffer.from(arrayBuffer))
console.log('[v0] Wrote cutout:', outputPath)
