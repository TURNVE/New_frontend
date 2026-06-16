import { Warp } from "@paper-design/shaders-react"

interface WarpShaderHeroProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  ctaText?: string;
  onCtaClick?: () => void;
  children?: React.ReactNode;
  height?: string;
  titleClassName?: string;
}

export default function WarpShaderHero({ 
  title, 
  subtitle, 
  ctaText, 
  onCtaClick, 
  children,
  height = "h-[600px]",
  titleClassName = "text-3xl md:text-5xl"
}: WarpShaderHeroProps) {
  return (
    <div className={`relative w-full ${height} overflow-hidden bg-gray-950`}>

      <div className="absolute inset-0">
        <Warp
          style={{ height: "100%", width: "100%" }}
          proportion={0.45}
          softness={1}
          distortion={0.25}
          swirl={0.8}
          swirlIterations={10}
          shape="checks"
          shapeScale={0.1}
          scale={1}
          rotation={0}
          speed={1}
          colors={["hsl(200, 100%, 10%)", "hsl(160, 100%, 40%)", "hsl(180, 90%, 15%)", "hsl(170, 100%, 45%)"]}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-8">
        <div className="max-w-4xl w-full text-center space-y-6">
          {title && (
            <h2 className={`text-white font-bold tracking-tighter leading-tight ${titleClassName}`}>
              {title}
            </h2>
          )}


          {subtitle && (
            <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto">
              {subtitle}
            </p>
          )}


          {children}

          {ctaText && (
            <div className="pt-4">
              <button 
                onClick={onCtaClick}
                className="px-8 py-3.5 bg-white text-gray-950 rounded-2xl font-bold text-base hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl shadow-blue-500/20"
              >
                {ctaText}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
