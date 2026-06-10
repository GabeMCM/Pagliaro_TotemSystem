import { useState, useRef, useEffect } from 'react'

export function FadeImage({ className = '', src, alt, style, onLoad, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setIsLoaded(false)
  }, [src])

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true)
    }
  }, [])

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      style={{
        opacity: isLoaded ? 1 : 0,
        filter: isLoaded ? 'blur(0px)' : 'blur(4px)',
        transition: 'opacity 1.2s ease-out, filter 1.2s ease-out',
        willChange: 'opacity, filter',
        ...style,
      }}
      onLoad={(e) => {
        setIsLoaded(true)
        if (onLoad) onLoad(e)
      }}
      {...props}
    />
  )
}
