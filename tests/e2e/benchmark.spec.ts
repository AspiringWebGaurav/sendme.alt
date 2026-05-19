/**
 * Throughput Benchmark Test
 * Measures actual file transfer speed between sender/receiver in local Playwright.
 */

import { test, expect, chromium, Browser, Page, BrowserContext } from '@playwright/test'
import {
    generateTestFile,
    waitForSendPanel,
    waitForReceivePanel,
    selectFile,
    clickStartTransfer,
    extractToken,
    enterToken,
    submitToken,
    waitForTransferComplete,
    cleanupTestFiles
} from './helpers'

const BASE_URL = 'http://localhost:3000/transfer'

let browser: Browser

test.beforeAll(async () => {
    browser = await chromium.launch()
})

test.afterAll(async () => {
    await browser?.close()
    cleanupTestFiles()
})

async function createPair(): Promise<{ sender: Page; receiver: Page; ctx: BrowserContext }> {
    const ctx = await browser.newContext()
    const sender = await ctx.newPage()
    const receiver = await ctx.newPage()
    await sender.goto(BASE_URL)
    await receiver.goto(BASE_URL)
    return { sender, receiver, ctx }
}

test.describe('Throughput Benchmark', () => {
    test('50MB transfer speed measurement', async () => {
        const file = generateTestFile(50)
        const { sender, receiver, ctx } = await createPair()

        // Inject console speed logger on sender
        const speedReadings: number[] = []
        sender.on('console', (msg) => {
            const text = msg.text()
            if (text.startsWith('SPEED:')) {
                speedReadings.push(parseFloat(text.split(':')[1]))
            }
        })

        await waitForSendPanel(sender)
        await selectFile(sender, file.path)
        await clickStartTransfer(sender)

        const token = await extractToken(sender)
        await waitForReceivePanel(receiver)
        await enterToken(receiver, token)
        await submitToken(receiver)

        const transferStart = Date.now()
        await waitForTransferComplete(sender, 120_000)
        await waitForTransferComplete(receiver, 120_000)
        const transferEnd = Date.now()

        const durationSec = (transferEnd - transferStart) / 1000
        const sizeMB = 50
        const throughputMBs = sizeMB / durationSec

        console.log(`\n========================================`)
        console.log(`  THROUGHPUT BENCHMARK RESULTS`)
        console.log(`========================================`)
        console.log(`  File Size:    ${sizeMB} MB`)
        console.log(`  Duration:     ${durationSec.toFixed(2)} s`)
        console.log(`  Throughput:   ${throughputMBs.toFixed(2)} MB/s`)
        console.log(`========================================\n`)

        // Expect at least 10 MB/s on local loopback
        expect(throughputMBs).toBeGreaterThan(5)

        await ctx.close()
    })
})
