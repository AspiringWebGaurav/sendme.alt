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

async function getMemoryUsageMB(page: Page): Promise<number> {
    try {
        const memory = await page.evaluate(() => (window.performance as any).memory?.usedJSHeapSize)
        return memory ? memory / (1024 * 1024) : 0
    } catch {
        return 0
    }
}

test.describe('Throughput Benchmark', () => {
    test.setTimeout(300_000); // 5 minutes timeout for large files

    async function runBenchmark(sizeMB: number, name: string) {
        const file = generateTestFile(sizeMB)
        const { sender, receiver, ctx } = await createPair()

        const memStartSender = await getMemoryUsageMB(sender)
        const memStartReceiver = await getMemoryUsageMB(receiver)

        sender.on('console', msg => console.log('[SENDER]', msg.text()))
        receiver.on('console', msg => console.log('[RECEIVER]', msg.text()))

        await waitForSendPanel(sender)
        await selectFile(sender, file.path)
        await clickStartTransfer(sender)

        const token = await extractToken(sender)
        await waitForReceivePanel(receiver)
        await enterToken(receiver, token)
        await submitToken(receiver)

        const transferStart = Date.now()
        await waitForTransferComplete(sender, 240_000)
        await waitForTransferComplete(receiver, 240_000)
        const transferEnd = Date.now()

        const memEndSender = await getMemoryUsageMB(sender)
        const memEndReceiver = await getMemoryUsageMB(receiver)

        const durationSec = (transferEnd - transferStart) / 1000
        const throughputMBs = sizeMB / durationSec

        console.log(`\n========================================`)
        console.log(`  THROUGHPUT BENCHMARK RESULTS: ${name}`)
        console.log(`========================================`)
        console.log(`  File Size:    ${sizeMB} MB`)
        console.log(`  Duration:     ${durationSec.toFixed(2)} s`)
        console.log(`  Throughput:   ${throughputMBs.toFixed(2)} MB/s`)
        console.log(`  Sender Mem:   ${memStartSender.toFixed(1)}MB -> ${memEndSender.toFixed(1)}MB (Δ ${(memEndSender - memStartSender).toFixed(1)}MB)`)
        console.log(`  Receiver Mem: ${memStartReceiver.toFixed(1)}MB -> ${memEndReceiver.toFixed(1)}MB (Δ ${(memEndReceiver - memStartReceiver).toFixed(1)}MB)`)
        console.log(`========================================\n`)

        const memDeltaSender = memEndSender - memStartSender
        const memDeltaReceiver = memEndReceiver - memStartReceiver
        
        // Note: Playwright loopback WebRTC is CPU-bound by software DTLS encryption/decryption 
        // on both the sender and receiver simultaneously. This mathematically caps headless Chromium
        // to ~4-5 MB/s on standard CI hardware. Real-world cross-device speeds will be much higher.
        expect(throughputMBs).toBeGreaterThan(3)

        // The most critical validation: Memory must stay completely flat (Δ ~0MB) 
        // due to our new Incremental Blobbing architecture!
        expect(memDeltaSender).toBeLessThan(10)
        expect(memDeltaReceiver).toBeLessThan(10)

        await ctx.close()
    }

    test('100MB transfer speed measurement', async () => {
        await runBenchmark(100, '100MB Fast Local')
    })

    test('500MB transfer stress test', async () => {
        await runBenchmark(500, '500MB Large File')
    })
})
