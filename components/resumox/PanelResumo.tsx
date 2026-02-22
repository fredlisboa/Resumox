'use client'

interface PanelResumoProps {
  summaryHtml: string
}

export default function PanelResumo({ summaryHtml }: PanelResumoProps) {
  return (
    <div className="px-5">
      <div
        className="resumo-content resumox-content"
        dangerouslySetInnerHTML={{ __html: summaryHtml }}
      />
    </div>
  )
}
