import { ImageResponse } from 'next/og'

export const alt = 'Sendme.alt - Secure P2P File Transfer'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'radial-gradient(circle at 50% 50%, #18181b 0%, #09090b 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        fontSize: 100,
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    SENDME.ALT
                </div>
                <div
                    style={{
                        fontSize: 40,
                        marginTop: 30,
                        color: '#A78BFA',
                        fontWeight: 500,
                        letterSpacing: '0.01em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    Secure P2P File Transfer. No Servers. No Limits.
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
