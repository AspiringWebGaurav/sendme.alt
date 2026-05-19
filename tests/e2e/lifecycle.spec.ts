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
    getStatusText,
    setupConsoleErrorTracker,
    waitForState,
    setNetworkThrottling,
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

test.describe('Lifecycle & Browser Behavior', () => {
    
    test('8. Token expiration during active transfer does NOT crash transfer (Passive Mode)', async () => {
        const file = generateTestFile(20) // Large enough to have time for disruption
        const { sender, receiver, ctx } = await createPair()
        const senderErrors = setupConsoleErrorTracker(sender)

        await waitForSendPanel(sender)
        await selectFile(sender, file.path)
        await clickStartTransfer(sender)

        const token = await extractToken(sender)
        await waitForReceivePanel(receiver)
        await enterToken(receiver, token)
        await submitToken(receiver)

        // Wait for transferring to begin on BOTH sides to ensure passive mode is active
        await waitForState(sender, 'Transferring', 30_000)
        await waitForState(receiver, 'Transferring', 30_000)

        // Force backend deletion (simulating TTL) using a direct fetch
        await sender.evaluate(async (token) => {
            await fetch('/api/cleanup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            })
        }, token)

        // Transfer should still complete successfully because of Passive Mode!
        await waitForTransferComplete(sender, 60_000)
        await waitForTransferComplete(receiver, 60_000)

        const criticalErrors = senderErrors.filter(e => !e.includes('[P2P]') && !e.includes('favicon'))
        expect(criticalErrors).toHaveLength(0)
        await ctx.close()
    })

    test('16. SSE signaling drop mid-transfer does NOT crash transfer', async () => {
        const file = generateTestFile(20)
        const { sender, receiver, ctx } = await createPair()
        
        await waitForSendPanel(sender)
        await selectFile(sender, file.path)
        await clickStartTransfer(sender)

        const token = await extractToken(sender)
        await waitForReceivePanel(receiver)
        await enterToken(receiver, token)
        await submitToken(receiver)

        await waitForState(sender, 'Transferring', 30_000)
        await waitForState(receiver, 'Transferring', 30_000)

        // Simulate SSE signaling connection drop via route interception,
        // proving that WebRTC survives even if signaling completely dies!
        await sender.route('**/api/listen**', route => route.abort())
        await receiver.route('**/api/listen**', route => route.abort())

        // WebRTC should complete unaffected
        await waitForTransferComplete(sender, 60_000)
        await ctx.close()
    })

    test('19. Slow network throttling', async () => {
        const file = generateTestFile(1)
        const { sender, receiver, ctx } = await createPair()
        
        await waitForSendPanel(sender)
        await selectFile(sender, file.path)
        await clickStartTransfer(sender)

        const token = await extractToken(sender)
        await waitForReceivePanel(receiver)
        await enterToken(receiver, token)
        await submitToken(receiver)

        // Throttle to 3G speeds
        await setNetworkThrottling(sender, { downloadThroughput: 50000, uploadThroughput: 50000, latency: 100 })
        
        await waitForTransferComplete(sender, 90_000)
        await ctx.close()
    })

    test('20. Multiple simultaneous sessions', async () => {
        const file1 = generateTestFile(1)
        const file2 = generateTestFile(1)

        const pair1 = await createPair()
        const pair2 = await createPair()

        // Setup pair 1
        await waitForSendPanel(pair1.sender)
        await selectFile(pair1.sender, file1.path)
        await clickStartTransfer(pair1.sender)
        const token1 = await extractToken(pair1.sender)

        // Setup pair 2
        await waitForSendPanel(pair2.sender)
        await selectFile(pair2.sender, file2.path)
        await clickStartTransfer(pair2.sender)
        const token2 = await extractToken(pair2.sender)

        // Connect both receivers
        await waitForReceivePanel(pair1.receiver)
        await enterToken(pair1.receiver, token1)
        await submitToken(pair1.receiver)

        await waitForReceivePanel(pair2.receiver)
        await enterToken(pair2.receiver, token2)
        await submitToken(pair2.receiver)

        // Both should complete without interference
        await waitForTransferComplete(pair1.sender, 60_000)
        await waitForTransferComplete(pair2.sender, 60_000)

        await pair1.ctx.close()
        await pair2.ctx.close()
    })
})
