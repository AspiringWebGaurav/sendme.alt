import { describe, it, expect } from 'vitest'
import {
  formatBytes,
  formatSpeed,
  formatTime,
  validateFileSize,
  getFileExtension,
  getFileIcon,
} from '@/core/webrtc/transfer'

describe('formatBytes', () => {
  it('returns "0 B" for zero bytes', () => {
    expect(formatBytes(0)).toBe('0 B')
  })

  it('formats bytes correctly', () => {
    expect(formatBytes(500)).toBe('500.00 B')
  })

  it('formats kilobytes correctly', () => {
    expect(formatBytes(1024)).toBe('1.00 KB')
    expect(formatBytes(1536)).toBe('1.50 KB')
  })

  it('formats megabytes correctly', () => {
    expect(formatBytes(1048576)).toBe('1.00 MB')
    expect(formatBytes(2097152)).toBe('2.00 MB')
  })

  it('formats gigabytes correctly', () => {
    expect(formatBytes(1073741824)).toBe('1.00 GB')
  })
})

describe('formatSpeed', () => {
  it('appends "/s" to the formatted bytes', () => {
    const result = formatSpeed(1048576)
    expect(result).toBe('1.00 MB/s')
  })
})

describe('formatTime', () => {
  it('returns "..." for infinity', () => {
    expect(formatTime(Infinity)).toBe('...')
  })

  it('returns "..." for negative values', () => {
    expect(formatTime(-1)).toBe('...')
  })

  it('returns seconds only for < 60s', () => {
    expect(formatTime(0)).toBe('0s')
    expect(formatTime(30)).toBe('30s')
    expect(formatTime(59)).toBe('59s')
  })

  it('returns minutes and seconds for < 3600s', () => {
    const result = formatTime(125)
    expect(result).toMatch(/^\d+m \d+s$/)
  })

  it('returns hours and minutes for >= 3600s', () => {
    const result = formatTime(3661)
    expect(result).toMatch(/^\d+h \d+m$/)
  })
})

describe('validateFileSize', () => {
  it('returns true for valid file sizes', () => {
    expect(validateFileSize(1024, 1048576)).toBe(true)
  })

  it('returns false for zero size', () => {
    expect(validateFileSize(0, 1048576)).toBe(false)
  })

  it('returns false for negative size', () => {
    expect(validateFileSize(-1, 1048576)).toBe(false)
  })

  it('returns false for size exceeding max', () => {
    expect(validateFileSize(2097152, 1048576)).toBe(false)
  })

  it('returns true for size equal to max', () => {
    expect(validateFileSize(1048576, 1048576)).toBe(true)
  })
})

describe('getFileExtension', () => {
  it('extracts extension from filename', () => {
    expect(getFileExtension('document.pdf')).toBe('pdf')
    expect(getFileExtension('image.PNG')).toBe('png')
    expect(getFileExtension('archive.tar.gz')).toBe('gz')
  })

  it('returns empty string for no extension', () => {
    expect(getFileExtension('README')).toBe('')
  })
})

describe('getFileIcon', () => {
  it('returns image icon for image types', () => {
    expect(getFileIcon('photo.jpg')).toBe('🖼️')
    expect(getFileIcon('photo.png')).toBe('🖼️')
    expect(getFileIcon('photo.webp')).toBe('🖼️')
  })

  it('returns video icon for video types', () => {
    expect(getFileIcon('movie.mp4')).toBe('🎥')
  })

  it('returns audio icon for audio types', () => {
    expect(getFileIcon('song.mp3')).toBe('🎵')
  })

  it('returns document icon for document types', () => {
    expect(getFileIcon('doc.pdf')).toBe('📄')
    expect(getFileIcon('readme.txt')).toBe('📄')
  })

  it('returns spreadsheet icon for spreadsheet types', () => {
    expect(getFileIcon('data.csv')).toBe('📊')
    expect(getFileIcon('report.xlsx')).toBe('📊')
  })

  it('returns archive icon for archive types', () => {
    expect(getFileIcon('archive.zip')).toBe('📦')
  })

  it('returns default icon for unknown types', () => {
    expect(getFileIcon('file.xyz')).toBe('📁')
  })
})