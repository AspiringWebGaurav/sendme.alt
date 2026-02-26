'use client'

import { useDeviceDetect } from '@/hooks/useDeviceDetect'
import { DesktopLanding } from '@/components/landing/DesktopLanding'
import { TabletLanding } from '@/components/landing/TabletLanding'
import { MobileLanding } from '@/components/landing/MobileLanding'

export default function LandingPage() {
    const { isMobile, isTablet } = useDeviceDetect()

    if (isMobile) return <MobileLanding />
    if (isTablet) return <TabletLanding />
    return <DesktopLanding />
}
