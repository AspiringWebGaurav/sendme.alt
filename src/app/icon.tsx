import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
                    borderRadius: '128px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                }}
            >
                <span
                    style={{
                        fontSize: 256,
                        background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
                        backgroundClip: 'text',
                        color: 'transparent',
                        fontWeight: 'bold',
                    }}
                >
                    🚀
                </span>
            </div>
        ),
        { ...size }
    )
}
