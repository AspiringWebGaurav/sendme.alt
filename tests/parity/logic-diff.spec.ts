/**
 * sendme.alt — Logic Parity Validation
 * Automated byte-level comparison of all core logic files
 * between new app and logic-intact/
 */

import { test, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const ROOT = path.resolve(__dirname, '..', '..')
const LEGACY = path.join(ROOT, 'logic-intact', 'src')
const NEW_APP = path.join(ROOT, 'src')

/**
 * Normalize a file's content for comparison:
 * - Strip carriage returns (Windows line ending normalization)
 * - Remove import path differences (the only expected change)
 */
function normalizeForComparison(content: string, isNewApp: boolean): string {
    let normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

    // Strip trailing whitespace per line (formatting only, no logic impact)
    normalized = normalized.split('\n').map(line => line.trimEnd()).join('\n')

    // Normalize import paths: the new app uses different directory structure
    // These are EXPECTED changes and should not flag as deviations
    if (isNewApp) {
        normalized = normalized
            .replace(/@\/core\/webrtc\//g, '@/lib/')
            .replace(/@\/core\/token\/token/g, '@/lib/token')
            .replace(/@\/core\//g, '@/lib/')
            .replace(/@\/services\//g, '@/lib/')
            .replace(/@\/state\//g, '@/contexts/')
            .replace(/from '\.\.\/constants'/g, "from './constants'")
    }

    // Normalize explicit `: any` type annotations on callback parameters.
    // The new app added these for TypeScript strict mode compliance.
    // They have zero runtime impact — purely compile-time annotations.
    // e.g. `(state: any) =>` vs `(state) =>`
    normalized = normalized.replace(/\((\w+): any\)/g, '($1)')
    normalized = normalized.replace(/\((\w+): any,/g, '($1,')

    return normalized
}

/**
 * Compare two files and return differences
 */
function compareFiles(legacyPath: string, newPath: string): { identical: boolean; diff: string } {
    if (!fs.existsSync(legacyPath)) {
        return { identical: false, diff: `Legacy file not found: ${legacyPath}` }
    }
    if (!fs.existsSync(newPath)) {
        return { identical: false, diff: `New file not found: ${newPath}` }
    }

    const legacyContent = normalizeForComparison(fs.readFileSync(legacyPath, 'utf-8'), false)
    const newContent = normalizeForComparison(fs.readFileSync(newPath, 'utf-8'), true)

    if (legacyContent === newContent) {
        return { identical: true, diff: '' }
    }

    // Find first difference for debugging
    const legacyLines = legacyContent.split('\n')
    const newLines = newContent.split('\n')
    const diffs: string[] = []

    const maxLines = Math.max(legacyLines.length, newLines.length)
    for (let i = 0; i < maxLines; i++) {
        const l = legacyLines[i] || '<EOF>'
        const n = newLines[i] || '<EOF>'
        if (l !== n) {
            diffs.push(`Line ${i + 1}:\n  LEGACY: ${l.trim()}\n  NEW:    ${n.trim()}`)
            if (diffs.length >= 5) {
                diffs.push(`... (${maxLines - i - 1} more lines differ)`)
                break
            }
        }
    }

    return { identical: false, diff: diffs.join('\n\n') }
}

// ============================================================================
// CORE LOGIC FILES — BYTE-LEVEL PARITY
// ============================================================================

test.describe('Logic Parity: Core Files', () => {
    test('webrtc.ts is logic-identical', () => {
        const result = compareFiles(
            path.join(LEGACY, 'lib', 'webrtc.ts'),
            path.join(NEW_APP, 'core', 'webrtc', 'webrtc.ts')
        )
        if (!result.identical) {
            console.log('DIFF REPORT:\n', result.diff)
        }
        expect(result.identical, `webrtc.ts differs:\n${result.diff}`).toBe(true)
    })

    test('transfer.ts is logic-identical', () => {
        const result = compareFiles(
            path.join(LEGACY, 'lib', 'transfer.ts'),
            path.join(NEW_APP, 'core', 'webrtc', 'transfer.ts')
        )
        if (!result.identical) {
            console.log('DIFF REPORT:\n', result.diff)
        }
        expect(result.identical, `transfer.ts differs:\n${result.diff}`).toBe(true)
    })

    test('constants.ts is logic-identical', () => {
        const result = compareFiles(
            path.join(LEGACY, 'lib', 'constants.ts'),
            path.join(NEW_APP, 'core', 'constants.ts')
        )
        if (!result.identical) {
            console.log('DIFF REPORT:\n', result.diff)
        }
        expect(result.identical, `constants.ts differs:\n${result.diff}`).toBe(true)
    })

    test('token.ts is logic-identical', () => {
        const result = compareFiles(
            path.join(LEGACY, 'lib', 'token.ts'),
            path.join(NEW_APP, 'core', 'token', 'token.ts')
        )
        if (!result.identical) {
            console.log('DIFF REPORT:\n', result.diff)
        }
        expect(result.identical, `token.ts differs:\n${result.diff}`).toBe(true)
    })

    test('urls.ts is logic-identical', () => {
        const result = compareFiles(
            path.join(LEGACY, 'lib', 'urls.ts'),
            path.join(NEW_APP, 'core', 'urls.ts')
        )
        if (!result.identical) {
            console.log('DIFF REPORT:\n', result.diff)
        }
        expect(result.identical, `urls.ts differs:\n${result.diff}`).toBe(true)
    })

    test('firebase-admin.ts is logic-identical', () => {
        const result = compareFiles(
            path.join(LEGACY, 'lib', 'firebase-admin.ts'),
            path.join(NEW_APP, 'services', 'firebase-admin.ts')
        )
        if (!result.identical) {
            console.log('DIFF REPORT:\n', result.diff)
        }
        expect(result.identical, `firebase-admin.ts differs:\n${result.diff}`).toBe(true)
    })
})

// ============================================================================
// HOOKS — STRUCTURAL PARITY (imports excluded)
// ============================================================================

test.describe('Logic Parity: Hooks', () => {
    test('useSend.ts is logic-identical (excluding imports)', () => {
        const result = compareFiles(
            path.join(LEGACY, 'hooks', 'useSend.ts'),
            path.join(NEW_APP, 'hooks', 'useSend.ts')
        )
        if (!result.identical) {
            console.log('DIFF REPORT:\n', result.diff)
        }
        expect(result.identical, `useSend.ts differs:\n${result.diff}`).toBe(true)
    })

    test('useReceive.ts is logic-identical (excluding imports)', () => {
        const result = compareFiles(
            path.join(LEGACY, 'hooks', 'useReceive.ts'),
            path.join(NEW_APP, 'hooks', 'useReceive.ts')
        )
        if (!result.identical) {
            console.log('DIFF REPORT:\n', result.diff)
        }
        expect(result.identical, `useReceive.ts differs:\n${result.diff}`).toBe(true)
    })
})

// ============================================================================
// API ROUTES — STRUCTURAL PARITY
// ============================================================================

test.describe('Logic Parity: API Routes', () => {
    const apiRoutes = ['create', 'validate', 'signal', 'listen', 'cleanup']

    for (const route of apiRoutes) {
        test(`api/${route}/route.ts is logic-identical`, () => {
            const result = compareFiles(
                path.join(LEGACY, '..', 'src', 'app', 'api', route, 'route.ts'),
                path.join(NEW_APP, 'app', 'api', route, 'route.ts')
            )
            if (!result.identical) {
                console.log('DIFF REPORT:\n', result.diff)
            }
            expect(result.identical, `api/${route}/route.ts differs:\n${result.diff}`).toBe(true)
        })
    }
})

// ============================================================================
// TYPES — STRUCTURAL PARITY
// ============================================================================

test.describe('Logic Parity: Types', () => {
    test('types/index.ts is logic-identical', () => {
        const result = compareFiles(
            path.join(LEGACY, '..', 'src', 'types', 'index.ts'),
            path.join(NEW_APP, 'types', 'index.ts')
        )
        if (!result.identical) {
            console.log('DIFF REPORT:\n', result.diff)
        }
        expect(result.identical, `types/index.ts differs:\n${result.diff}`).toBe(true)
    })
})
