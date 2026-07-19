import QRCodeStyling from 'qr-code-styling';
import { useEffect, useRef } from 'react';
import iconSvg from '../../assets/agnostric-a.png';

export default function QrCode({ value, size = 180 }: { value: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      const pixelRatio = window.devicePixelRatio || 2

      const qrCode = new QRCodeStyling({
        qrOptions: {
          errorCorrectionLevel: 'M'
        },
        image: iconSvg,
        width: size * pixelRatio,
        height: size * pixelRatio,
        data: value,
        dotsOptions: {
          color: '#f6be6199',
          type: 'dots',
        },
        backgroundOptions: {
          color: 'transparent',
        },
        cornersSquareOptions: {
          color: '#f6be6199',
          type: 'extra-rounded',
        },
        cornersDotOptions: {
          color: '#f6be6199',
          type: 'dot',
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 6,
          imageSize: 0.4,
        },
      })

      if (ref.current) {
        ref.current.innerHTML = ''
        qrCode.append(ref.current)
        const canvas = ref.current.querySelector('canvas')
        if (canvas) {
          canvas.style.width = `${size}px`
          canvas.style.height = `${size}px`
          canvas.style.maxWidth = '100%'
          canvas.style.height = 'auto'
        }
      }
    }, 0)

    return () => {
      if (ref.current) ref.current.innerHTML = ''
    }
  }, [value, size])

  return (
    <div className="overflow-hidden rounded-2xl p-2">
      <div ref={ref} />
    </div>
  )
}
