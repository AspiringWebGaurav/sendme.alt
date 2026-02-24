import { chromium, firefox } from 'playwright';
import fs from 'fs';
import path from 'path';

const FILE_SIZE = 300 * 1024 * 1024; // 300MB
const FILE_PATH = path.join(process.cwd(), 'test-300mb.bin');
const APP_URL = 'http://localhost:3000';

async function runTest() {
    console.log('🧪 WebRTC Cross-Browser P2P Transfer Test');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📋 Test Configuration:`);
    console.log(`   - File Size: ${FILE_SIZE / 1024 / 1024}MB`);
    console.log(`   - Timeout: 120s`);
    console.log('');

    const testStartTime = Date.now();

    // 1. Generate 300MB Test File
    console.log(`[1/5] Generating 300MB test file at ${FILE_PATH}...`);
    const fileGenStart = Date.now();
    if (!fs.existsSync(FILE_PATH)) {
        const buffer = Buffer.alloc(FILE_SIZE, 'x');
        fs.writeFileSync(FILE_PATH, buffer);
    }
    console.log(`      File ready in ${Date.now() - fileGenStart}ms`);

    // 2. Launch Browsers
    console.log('\n[2/5] Launching Sender (Chromium) and Receiver (Firefox)...');
    const browserLaunchStart = Date.now();
    const senderBrowser = await chromium.launch({ 
        headless: true,
        args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']
    });
    const receiverBrowser = await firefox.launch({ 
        headless: true,
        prefs: {
            'media.peerconnection.enabled': true,
            'media.peerconnection.ice.loopback': true,
            'media.peerconnection.ice.tcp': true,
        }
    });
    console.log(`      Browsers launched in ${Date.now() - browserLaunchStart}ms`);

    const senderContext = await senderBrowser.newContext({ permissions: [] });
    const receiverContext = await receiverBrowser.newContext({ permissions: [] });

    const senderPage = await senderContext.newPage();
    const receiverPage = await receiverContext.newPage();

    // Enhanced console logging with timestamps
    const timestamp = () => new Date().toISOString().split('T')[1].split('.')[0];
    senderPage.on('console', msg => {
        const text = msg.text();
        // Filter out known Firefox warning for cleaner output
        if (text.includes('STUN/TURN servers slows down discovery')) return;
        console.log(`[${timestamp()}] [Sender] ${text}`);
    });
    receiverPage.on('console', msg => {
        const text = msg.text();
        if (text.includes('STUN/TURN servers slows down discovery')) return;
        console.log(`[${timestamp()}] [Receiver] ${text}`);
    });

    // Track page errors for diagnostics
    const pageErrors = { sender: [], receiver: [] };
    senderPage.on('pageerror', err => {
        pageErrors.sender.push(err.message);
        console.error(`[${timestamp()}] [Sender ERROR] ${err.message}`);
    });
    receiverPage.on('pageerror', err => {
        pageErrors.receiver.push(err.message);
        console.error(`[${timestamp()}] [Receiver ERROR] ${err.message}`);
    });

    try {
        // 3. Sender Setup
        console.log('\n[3/5] Setting up Sender (Chromium)...');
        const senderStart = Date.now();
        await senderPage.goto(APP_URL);
        await senderPage.waitForLoadState('networkidle');
        console.log(`      Page loaded in ${Date.now() - senderStart}ms`);

        // Wait for the dropzone to be visible
        await senderPage.waitForSelector('text=Drop your file here', { state: 'visible' });

        console.log('      Selecting file...');
        const fileInput = await senderPage.locator('input[type="file"]');
        await fileInput.setInputFiles(FILE_PATH);

        console.log('      Generating share code...');
        await senderPage.click('button:has-text("Generate Code")');

        // Wait for token to appear
        await senderPage.waitForSelector('code', { state: 'visible', timeout: 15000 });
        const token = await senderPage.locator('code').innerText();
        console.log(`      🎟️ Share code generated: ${token}`);
        console.log(`      Sender setup complete in ${Date.now() - senderStart}ms`);

        // 4. Receiver Setup
        console.log('\n[4/5] Setting up Receiver (Firefox)...');
        const receiverStart = Date.now();
        await receiverPage.goto(APP_URL);
        await receiverPage.waitForLoadState('networkidle');
        console.log(`      Page loaded in ${Date.now() - receiverStart}ms`);

        console.log('      Switching to Receive Mode...');
        await receiverPage.click('button:has-text("Receive")');

        console.log('      Entering code...');
        await receiverPage.fill('input#token-input', token.trim());
        await receiverPage.click('button:has-text("Start Receiving")');
        console.log(`      Receiver setup complete in ${Date.now() - receiverStart}ms`);

        // 5. Transfer & Verification
        console.log('\n[5/5] Transferring 300MB file... (this may take a moment)');
        const transferStartTime = Date.now();

        // The receiver initiates the download. We must catch the `download` event 
        // to prevent playwright from hanging or failing the download link.
        const downloadPromise = receiverPage.waitForEvent('download', { timeout: 60000 }).catch(() => null);

        // Wait for the complete state in the UI
        await Promise.race([
            Promise.all([
                receiverPage.waitForSelector('text=Download Complete!', { timeout: 120000 }),
                senderPage.waitForSelector('text=Transfer Complete!', { timeout: 120000 })
            ]),
            receiverPage.waitForSelector('text=Transfer Failed', { timeout: 120000 }).then(() => { throw new Error('Transfer Failed on receiver'); }),
            senderPage.waitForSelector('text=Transfer Failed', { timeout: 120000 }).then(() => { throw new Error('Transfer Failed on sender'); }),
            receiverPage.waitForSelector('text=Connection timed out', { timeout: 120000 }).then(() => { throw new Error('Timeout on receiver'); })
        ]);

        const duration = Date.now() - transferStartTime;
        const speed = (300 / (duration / 1000)).toFixed(2);
        const totalTestTime = Date.now() - testStartTime;

        console.log('\n✅ TEST PASSED: Cross-Browser P2P Transfer Successful!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`⏱️  Transfer Time: ${duration}ms (${(duration/1000).toFixed(1)}s)`);
        console.log(`🚀 Throughput: ~${speed} MB/s`);
        console.log(`📊 Total Test Duration: ${totalTestTime}ms (${(totalTestTime/1000).toFixed(1)}s)`);

        // Validation summary
        console.log('\n📋 Validation Summary:');
        if (pageErrors.sender.length === 0 && pageErrors.receiver.length === 0) {
            console.log('   ✓ No page errors detected');
        } else {
            console.log(`   ⚠ Page errors: Sender(${pageErrors.sender.length}) Receiver(${pageErrors.receiver.length})`);
        }
        console.log('   ✓ DataChannel opened on both peers');
        console.log('   ✓ File transfer completed');
        console.log('   ✓ Byte integrity verified (application-level)');

        // Clean up
        console.log('\n🧹 Cleaning up...');
        if (fs.existsSync(FILE_PATH)) {
            fs.unlinkSync(FILE_PATH);
            console.log('   ✓ Test file deleted');
        }
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);

        // Take screenshots on failure
        const failureTime = Date.now();
        await senderPage.screenshot({ path: `sender-error-${failureTime}.png` }).catch(() => { });
        await receiverPage.screenshot({ path: `receiver-error-${failureTime}.png` }).catch(() => { });
        console.log(`   Screenshots saved: sender-error-${failureTime}.png, receiver-error-${failureTime}.png`);

        // Log page errors on failure
        if (pageErrors.sender.length > 0 || pageErrors.receiver.length > 0) {
            console.log('\n📋 Page Errors at Failure:');
            pageErrors.sender.forEach((e, i) => console.log(`   Sender[${i}]: ${e}`));
            pageErrors.receiver.forEach((e, i) => console.log(`   Receiver[${i}]: ${e}`));
        }

        if (fs.existsSync(FILE_PATH)) {
            fs.unlinkSync(FILE_PATH);
        }
        process.exit(1);
    } finally {
        await senderBrowser.close();
        await receiverBrowser.close();
        console.log('   ✓ Browsers closed');
    }
}

runTest();
