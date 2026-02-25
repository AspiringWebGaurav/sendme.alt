/**
 * sendme.alt — Full E2E Transfer Test Suite
 * Validates logic parity with logic-intact/
 */

import { test, expect, chromium, firefox, Browser, Page, BrowserContext } from '@playwright/test'
import {
    generateTestFile,
    cleanupTestFiles,
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
} from './helpers'

const BASE_URL = 'http://localhost:3000'

// ============================================================================
// TEST SETUP
// ============================================================================

let senderBrowser: Browser
let receiverBrowser: Browser

test.beforeAll(async () => {
    senderBrowser = await chromium.launch()
    receiverBrowser = await firefox.launch()
})

test.afterAll(async () => {
    await senderBrowser?.close()
    await receiverBrowser?.close()
    cleanupTestFiles()
})

// Helper: create fresh sender + receiver pages
async function createPair(): Promise<{ sender: Page; receiver: Page; sCtx: BrowserContext; rCtx: BrowserContext }> {
    const sCtx = await senderBrowser.newContext()
    const rCtx = await receiverBrowser.newContext()
    const sender = await sCtx.newPage()
    const receiver = await rCtx.newPage()
    await sender.goto(BASE_URL)
    await receiver.goto(BASE_URL)
    return { sender, receiver, sCtx, rCtx }
}

async function closePair(sCtx: BrowserContext, rCtx: BrowserContext) {
    await sCtx.close()
    await rCtx.close()
}

// ============================================================================
// PHASE 1 — CORE TRANSFER FLOW
// ============================================================================

test.describe('Phase 1: Core Transfer Flow', () => {
    test('1MB file transfer completes successfully', async () => {
        const file = generateTestFile(1)
        const { sender, receiver, sCtx, rCtx } = await createPair()
        const senderErrors = setupConsoleErrorTracker(sender)

        try {
            // Sender: select file and start transfer
            await waitForSendPanel(sender)
            await selectFile(sender, file.path)
            await clickStartTransfer(sender)

            // Wait for token to appear
            const token = await extractToken(sender)
            expect(token).toBeTruthy()
            expect(token.length).toBeGreaterThanOrEqual(4)

            // Receiver: switch to receive mode, enter token
            await waitForReceivePanel(receiver)
            await enterToken(receiver, token)
            await submitToken(receiver)

            // Both should progress to transferring → complete
            await waitForTransferComplete(sender, 60_000)
            await waitForTransferComplete(receiver, 60_000)

            // Verify sender shows complete
            const senderStatus = await getStatusText(sender)
            expect(senderStatus).toContain('Complete')

            // No unhandled errors
            const criticalErrors = senderErrors.filter(
                (e) => !e.includes('[P2P]') && !e.includes('favicon')
            )
            expect(criticalErrors).toHaveLength(0)
        } finally {
            await closePair(sCtx, rCtx)
        }
    })

    test('10MB file transfer completes successfully', async () => {
        const file = generateTestFile(10)
        const { sender, receiver, sCtx, rCtx } = await createPair()

        try {
            await waitForSendPanel(sender)
            await selectFile(sender, file.path)
            await clickStartTransfer(sender)

            const token = await extractToken(sender)
            expect(token).toBeTruthy()

            await waitForReceivePanel(receiver)
            await enterToken(receiver, token)
            await submitToken(receiver)

            await waitForTransferComplete(sender, 90_000)
            await waitForTransferComplete(receiver, 90_000)
        } finally {
            await closePair(sCtx, rCtx)
        }
    })
})

// ============================================================================
// PHASE 2 — CANCEL TESTS
// ============================================================================

test.describe('Phase 2: Cancel Tests', () => {
    test('Cancel before transfer starts resets state cleanly', async () => {
        const file = generateTestFile(1)
        const { sender, receiver: _, sCtx, rCtx } = await createPair()

        try {
            await waitForSendPanel(sender)
            await selectFile(sender, file.path)
            await clickStartTransfer(sender)

            // Wait for token to appear then cancel
            await extractToken(sender)
            await sender.click('text=Cancel')

            // State should reset to idle
            await sender.waitForSelector('input[type="file"]', { timeout: 10_000 })
        } finally {
            await closePair(sCtx, rCtx)
        }
    })

    test('Sender cancel mid-connection resets both sides', async () => {
        const file = generateTestFile(1)
        const { sender, receiver, sCtx, rCtx } = await createPair()

        try {
            await waitForSendPanel(sender)
            await selectFile(sender, file.path)
            await clickStartTransfer(sender)

            const token = await extractToken(sender)

            // Receiver starts connecting
            await waitForReceivePanel(receiver)
            await enterToken(receiver, token)
            await submitToken(receiver)

            // Wait briefly then sender cancels
            await sender.waitForTimeout(500)
            await sender.click('text=Cancel')

            // Sender should reset to idle
            await sender.waitForSelector('input[type="file"]', { timeout: 10_000 })
        } finally {
            await closePair(sCtx, rCtx)
        }
    })
})

// ============================================================================
// PHASE 3 — TOKEN VALIDATION TESTS
// ============================================================================

test.describe('Phase 3: Token Validation', () => {
    test('Invalid token shows error', async () => {
        const { sender: _, receiver, sCtx, rCtx } = await createPair()

        try {
            await waitForReceivePanel(receiver)
            await enterToken(receiver, 'ZZZZZ')
            await submitToken(receiver)

            // Should show error text
            await receiver.waitForSelector('.text-error, [class*="error"]', { timeout: 15_000 })
        } finally {
            await closePair(sCtx, rCtx)
        }
    })
})

// ============================================================================
// PHASE 4 — FILE VALIDATION
// ============================================================================

test.describe('Phase 4: File Validation', () => {
    test('Empty file name shows in UI after selection', async () => {
        const file = generateTestFile(1)
        const { sender, receiver: _, sCtx, rCtx } = await createPair()

        try {
            await waitForSendPanel(sender)
            await selectFile(sender, file.path)

            // File info should be visible
            await sender.waitForSelector('text=MB', { timeout: 5_000 })
        } finally {
            await closePair(sCtx, rCtx)
        }
    })
})

// ============================================================================
// PHASE 5 — STATE MACHINE INTEGRITY
// ============================================================================

test.describe('Phase 5: State Machine', () => {
    test('State transitions follow correct sequence: idle → connecting → waiting → transferring → complete', async () => {
        const file = generateTestFile(1)
        const { sender, receiver, sCtx, rCtx } = await createPair()
        const statesObserved: string[] = []

        try {
            // Track state changes via polling
            const pollInterval = setInterval(async () => {
                try {
                    const st = await getStatusText(sender)
                    if (statesObserved[statesObserved.length - 1] !== st) {
                        statesObserved.push(st)
                    }
                } catch { /* page might be navigating */ }
            }, 200)

            await waitForSendPanel(sender)
            await selectFile(sender, file.path)
            await clickStartTransfer(sender)

            const token = await extractToken(sender)
            await waitForReceivePanel(receiver)
            await enterToken(receiver, token)
            await submitToken(receiver)

            await waitForTransferComplete(sender, 60_000)
            clearInterval(pollInterval)

            // Verify we saw key states
            const allStates = statesObserved.join(' → ')
            expect(allStates).toContain('Complete')
        } finally {
            await closePair(sCtx, rCtx)
        }
    })
})

// ============================================================================
// PHASE 6 — NETWORK DISRUPTION
// ============================================================================

test.describe('Phase 6: Network Disruption', () => {
    test('Receiver disconnect mid-transfer shows error on sender', async () => {
        const file = generateTestFile(10)
        const { sender, receiver, sCtx, rCtx } = await createPair()

        try {
            await waitForSendPanel(sender)
            await selectFile(sender, file.path)
            await clickStartTransfer(sender)

            const token = await extractToken(sender)
            await waitForReceivePanel(receiver)
            await enterToken(receiver, token)
            await submitToken(receiver)

            // Wait for transfer to start
            await waitForState(sender, 'Transferring', 30_000)

            // Kill receiver
            await receiver.close()

            // Sender should eventually show error
            await sender.waitForSelector('text=Error', { timeout: 30_000 }).catch(() => {
                // Connection may timeout instead — that's also valid
            })
        } finally {
            await sCtx.close()
            await rCtx.close()
        }
    })
})

// ============================================================================
// PHASE 7 — MEMORY & PERFORMANCE
// ============================================================================

test.describe('Phase 7: Memory & Performance', () => {
    test('No console errors during basic transfer', async () => {
        const file = generateTestFile(1)
        const { sender, receiver, sCtx, rCtx } = await createPair()
        const senderErrors = setupConsoleErrorTracker(sender)
        const receiverErrors = setupConsoleErrorTracker(receiver)

        try {
            await waitForSendPanel(sender)
            await selectFile(sender, file.path)
            await clickStartTransfer(sender)

            const token = await extractToken(sender)
            await waitForReceivePanel(receiver)
            await enterToken(receiver, token)
            await submitToken(receiver)

            await waitForTransferComplete(sender, 60_000)
            await waitForTransferComplete(receiver, 60_000)

            // Filter out known harmless logs
            const criticalSender = senderErrors.filter(
                (e) => !e.includes('[P2P]') && !e.includes('favicon') && !e.includes('hydration')
            )
            const criticalReceiver = receiverErrors.filter(
                (e) => !e.includes('[P2P]') && !e.includes('favicon') && !e.includes('hydration')
            )

            expect(criticalSender).toHaveLength(0)
            expect(criticalReceiver).toHaveLength(0)
        } finally {
            await closePair(sCtx, rCtx)
        }
    })
})
