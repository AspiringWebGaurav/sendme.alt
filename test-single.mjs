/**
 * Minimal diagnostic test — single 5MB transfer with FULL console output
 */
import { chromium, firefox } from 'playwright';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const APP_URL = 'http://localhost:3000';

// Create test file
const filePath = join(tmpdir(), `sendme-diag-${Date.now()}.bin`);
const buf = Buffer.alloc(5 * 1024 * 1024); // 5MB
for (let i = 0; i < buf.length; i++) buf[i] = i & 0xff;
writeFileSync(filePath, buf);

console.log('=== DIAGNOSTIC: Single 5MB Transfer ===');
console.log(`File: ${filePath} (${buf.length} bytes)`);

let senderBrowser, receiverBrowser;

try {
    senderBrowser = await chromium.launch({ headless: true });
    receiverBrowser = await firefox.launch({ headless: true });

    const senderPage = await (await senderBrowser.newContext()).newPage();
    const receiverPage = await (await receiverBrowser.newContext()).newPage();

    // Capture ALL console output
    senderPage.on('console', msg => console.log(`[S] ${msg.type()}: ${msg.text()}`));
    senderPage.on('pageerror', err => console.log(`[S] ERROR: ${err.message}`));
    receiverPage.on('console', msg => console.log(`[R] ${msg.type()}: ${msg.text()}`));
    receiverPage.on('pageerror', err => console.log(`[R] ERROR: ${err.message}`));

    // ── SENDER ──
    console.log('\n--- Step 1: Sender navigates ---');
    await senderPage.goto(APP_URL);
    await senderPage.waitForLoadState('networkidle');
    console.log('Sender page loaded');

    // Wait for drop zone
    await senderPage.waitForSelector('text=Drop your file here', { state: 'visible', timeout: 10000 });
    console.log('Drop zone visible');

    // Select file
    await senderPage.locator('input[type="file"]').setInputFiles(filePath);
    console.log('File selected via setInputFiles');

    // Wait for Generate Code button
    try {
        await senderPage.waitForSelector('button:has-text("Generate Code")', { state: 'visible', timeout: 10000 });
        console.log('"Generate Code" button appeared');
    } catch (e) {
        console.log(`FAILED waiting for "Generate Code": ${e.message}`);
        // Dump page content for debugging
        const html = await senderPage.content();
        console.log('Page HTML snippet:', html.substring(0, 2000));
        throw e;
    }

    await senderPage.click('button:has-text("Generate Code")');
    console.log('Clicked "Generate Code"');

    await senderPage.waitForSelector('code', { state: 'visible', timeout: 15000 });
    const token = (await senderPage.locator('code').innerText()).trim();
    console.log(`Token generated: ${token}`);

    // ── RECEIVER ──
    console.log('\n--- Step 2: Receiver navigates ---');
    await receiverPage.goto(APP_URL);
    await receiverPage.waitForLoadState('networkidle');
    await receiverPage.click('button:has-text("Receive")');
    await receiverPage.fill('input#token-input', token);
    console.log('Receiver entered token');

    const start = Date.now();
    await receiverPage.click('button:has-text("Start Receiving")');
    console.log('Clicked "Start Receiving"');

    // ── WAIT ──
    console.log('\n--- Step 3: Waiting for completion (max 120s) ---');

    // Check periodically what both pages show
    const checkInterval = setInterval(async () => {
        try {
            const senderState = await senderPage.evaluate(() => {
                const body = document.body.innerText;
                if (body.includes('Transfer Complete!')) return 'COMPLETE';
                if (body.includes('Transfer Failed')) return 'FAILED';
                if (body.includes('Transferring')) return 'TRANSFERRING';
                if (body.includes('Connecting')) return 'CONNECTING';
                return 'UNKNOWN';
            });
            const receiverState = await receiverPage.evaluate(() => {
                const body = document.body.innerText;
                if (body.includes('Download Complete!')) return 'COMPLETE';
                if (body.includes('Transfer Failed')) return 'FAILED';
                if (body.includes('Receiving')) return 'RECEIVING';
                if (body.includes('Connecting')) return 'CONNECTING';
                return 'UNKNOWN';
            });
            const elapsed = ((Date.now() - start) / 1000).toFixed(1);
            console.log(`[${elapsed}s] Sender: ${senderState} | Receiver: ${receiverState}`);
        } catch { }
    }, 2000);

    try {
        await Promise.race([
            Promise.all([
                senderPage.waitForSelector('text=Transfer Complete!', { timeout: 120000 }),
                receiverPage.waitForSelector('text=Download Complete!', { timeout: 120000 }),
            ]),
            senderPage.waitForSelector('text=Transfer Failed', { timeout: 120000 }).then(() => { throw new Error('Transfer Failed on sender'); }),
            receiverPage.waitForSelector('text=Transfer Failed', { timeout: 120000 }).then(() => { throw new Error('Transfer Failed on receiver'); }),
        ]);

        const totalMs = Date.now() - start;
        console.log(`\n✅ SUCCESS in ${totalMs}ms`);
    } catch (e) {
        console.log(`\n❌ FAILED: ${e.message}`);

        // Dump final page states
        console.log('\n--- Sender final page text ---');
        const sText = await senderPage.evaluate(() => document.body.innerText).catch(() => 'UNAVAILABLE');
        console.log(sText.substring(0, 1000));

        console.log('\n--- Receiver final page text ---');
        const rText = await receiverPage.evaluate(() => document.body.innerText).catch(() => 'UNAVAILABLE');
        console.log(rText.substring(0, 1000));
    } finally {
        clearInterval(checkInterval);
    }

} catch (e) {
    console.log(`\nFATAL: ${e.message}`);
} finally {
    await senderBrowser?.close().catch(() => { });
    await receiverBrowser?.close().catch(() => { });
    if (existsSync(filePath)) unlinkSync(filePath);
}
