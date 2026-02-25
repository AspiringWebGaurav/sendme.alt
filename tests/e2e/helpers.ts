/**
 * sendme.alt — E2E Test Helpers
 * Shared utilities for Playwright tests
 */

import { Page } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'

const TEST_FILES_DIR = path.join(__dirname, '..', '..', 'test-artifacts')

/**
 * Generate a test file of specified size with random content
 */
export function generateTestFile(sizeMB: number): { path: string; name: string; size: number; hash: string } {
    if (!fs.existsSync(TEST_FILES_DIR)) {
        fs.mkdirSync(TEST_FILES_DIR, { recursive: true })
    }

    const fileName = `test-file-${sizeMB}MB-${Date.now()}.bin`
    const filePath = path.join(TEST_FILES_DIR, fileName)
    const sizeBytes = sizeMB * 1024 * 1024

    // Generate file in 1MB chunks for memory efficiency
    const chunkSize = 1024 * 1024
    const hash = crypto.createHash('sha256')
    const fd = fs.openSync(filePath, 'w')

    let written = 0
    while (written < sizeBytes) {
        const remaining = sizeBytes - written
        const size = Math.min(chunkSize, remaining)
        const chunk = crypto.randomBytes(size)
        fs.writeSync(fd, chunk)
        hash.update(chunk)
        written += size
    }
    fs.closeSync(fd)

    return {
        path: filePath,
        name: fileName,
        size: sizeBytes,
        hash: hash.digest('hex'),
    }
}

/**
 * Clean up test artifacts
 */
export function cleanupTestFiles() {
    if (fs.existsSync(TEST_FILES_DIR)) {
        fs.rmSync(TEST_FILES_DIR, { recursive: true, force: true })
    }
}

/**
 * Wait for the Send panel to be visible
 */
export async function waitForSendPanel(page: Page) {
    // The send panel shows a file drop zone by default
    await page.waitForSelector('input[type="file"]', { timeout: 10_000 })
}

/**
 * Wait for the Receive panel to be visible
 */
export async function waitForReceivePanel(page: Page) {
    // Click on 'Receive' toggle to switch mode
    await page.click('text=Receive')
    await page.waitForSelector('input[type="text"]', { timeout: 10_000 })
}

/**
 * Select a file in the Send panel via file input
 */
export async function selectFile(page: Page, filePath: string) {
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(filePath)
}

/**
 * Click the Start Transfer button
 */
export async function clickStartTransfer(page: Page) {
    await page.click('text=Start Transfer', { timeout: 10_000 })
}

/**
 * Extract the generated token from the sender's UI
 */
export async function extractToken(page: Page): Promise<string> {
    // Wait for token to appear (the token is displayed as large mono text)
    await page.waitForSelector('.font-mono.tracking-widest', { timeout: 30_000 })
    const tokenElement = page.locator('.font-mono.tracking-widest').first()
    const token = await tokenElement.textContent()
    if (!token) throw new Error('Token not found in UI')
    return token.trim()
}

/**
 * Enter a token in the Receive panel
 */
export async function enterToken(page: Page, token: string) {
    const input = page.locator('input[type="text"]')
    await input.fill(token)
}

/**
 * Submit the token (click the arrow button)
 */
export async function submitToken(page: Page) {
    // Click the submit button (the one with ArrowRight icon inside the input container)
    await page.locator('input[type="text"]').press('Enter')
}

/**
 * Wait for transfer to complete on a page
 */
export async function waitForTransferComplete(page: Page, timeoutMs = 120_000) {
    await page.waitForSelector('text=Complete', { timeout: timeoutMs })
}

/**
 * Get current state text from the status indicator
 */
export async function getStatusText(page: Page): Promise<string> {
    const indicator = page.locator('.rounded-full .text-xs.font-medium').first()
    return (await indicator.textContent()) || 'unknown'
}

/**
 * Check for console errors on a page
 */
export function setupConsoleErrorTracker(page: Page): string[] {
    const errors: string[] = []
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            errors.push(msg.text())
        }
    })
    page.on('pageerror', (err) => {
        errors.push(err.message)
    })
    return errors
}

/**
 * Wait for a specific state text
 */
export async function waitForState(page: Page, stateText: string, timeoutMs = 30_000) {
    await page.waitForFunction(
        (text) => {
            const el = document.querySelector('.rounded-full .text-xs.font-medium')
            return el?.textContent?.includes(text)
        },
        stateText,
        { timeout: timeoutMs }
    )
}
