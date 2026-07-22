import { SecondaryPageLink, useSecondaryPage } from '@/PageManager'
import { FormattedTimestamp } from '@/components/FormattedTimestamp'
import HighlightButton from '@/components/HighlightButton'
import ImageWithLightbox from '@/components/ImageWithLightbox'
import PostEditor from '@/components/PostEditor'
import { useTranslatedEvent } from '@/hooks'
import { getLongFormArticleMetadataFromEvent } from '@/lib/event-metadata'
import { toNote, toNoteList, toProfile } from '@/lib/link'
import { estimateReadingMinutes } from '@/lib/markdown'
import { formatTextWithFontFallback } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import { Event, kinds } from 'nostr-tools'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { createMarkdownComponents } from './MarkdownComponents'
import NostrNode from './NostrNode'
import { remarkNostr } from './remarkNostr'
import { Components } from './types'

export default function LongFormArticle({
  event,
  className
}: {
  event: Event
  className?: string
}) {
  const { t } = useTranslation()
  const { push } = useSecondaryPage()
  const translatedEvent = useTranslatedEvent(event.id)
  const displayEvent = translatedEvent ?? event
  const metadata = useMemo(
    () => getLongFormArticleMetadataFromEvent(displayEvent),
    [displayEvent]
  )
  const readingMinutes = useMemo(
    () => estimateReadingMinutes(displayEvent.content),
    [displayEvent.content]
  )
  const contentRef = useRef<HTMLDivElement>(null)
  const [showHighlightEditor, setShowHighlightEditor] = useState(false)
  const [selectedText, setSelectedText] = useState('')

  const handleHighlight = (text: string) => {
    setSelectedText(text)
    setShowHighlightEditor(true)
  }

  const baseComponents = useMemo(
    () =>
      ({
        nostr: ({ rawText, bech32Id }) => <NostrNode rawText={rawText} bech32Id={bech32Id} />,
        a: ({ href, children, ...props }) => {
          if (!href) {
            return <span {...props} className="wrap-break-word" />
          }
          if (href.startsWith('note1') || href.startsWith('nevent1') || href.startsWith('naddr1')) {
            return (
              <SecondaryPageLink
                to={toNote(href)}
                className="wrap-break-word text-foreground underline"
              >
                {children}
              </SecondaryPageLink>
            )
          }
          if (href.startsWith('npub1') || href.startsWith('nprofile1')) {
            return (
              <SecondaryPageLink
                to={toProfile(href)}
                className="wrap-break-word text-foreground underline"
              >
                {children}
              </SecondaryPageLink>
            )
          }
          return (
            <a
              {...props}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="wrap-break-word"
            >
              {children}
              <ExternalLink className="ms-1 inline size-3 align-baseline" />
            </a>
          )
        },
        p: (props) => <p {...props} className="wrap-break-word" />,
        div: (props) => <div {...props} className="wrap-break-word" />,
        code: (props) => <code {...props} className="whitespace-pre-wrap wrap-break-word" />,
        img: (props) => (
          <ImageWithLightbox
            image={{ url: props.src || '', pubkey: event.pubkey }}
            className="my-0 max-h-[80vh] object-contain sm:max-h-[50vh]"
            classNames={{
              wrapper: 'w-fit max-w-full'
            }}
          />
        )
      }) as Components,
    [event.pubkey]
  )

  const markdownComponents = useMemo(
    () =>
      createMarkdownComponents({
        heroImage: metadata.image,
        existingComponents: baseComponents as any,
      }),
    [metadata.image, baseComponents]
  )

  const titleProcessed = formatTextWithFontFallback(metadata.title, { fontClass: 'font-agnostric', fallbackFontClass: 'font-cormorant font-semibold' });

  return (
    <>
      <div
        ref={contentRef}
        className={`overflow-wrap-anywhere lfa-note max-w-none wrap-break-word prose-img:my-0 ${className || ''}`}
      >
        <h1 className="wrap-break-word note-title">{titleProcessed}</h1>
        <div className="mb-10 text-sm text-muted-foreground">
          {t('{{count}} min read', { count: readingMinutes })}
          <span className="mx-1.5">❃</span>
          {t('Last edited')}: <FormattedTimestamp timestamp={event.created_at} />
        </div>
        {metadata.summary && (
          <blockquote className="note-intro">
            <p className="whitespace-pre-line wrap-break-word">{metadata.summary}</p>
          </blockquote>
        )}
        {metadata.image && (
          <div className="my-8 w-full">
            <div className="relative w-full rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-black/5">


              <img src={metadata.image} alt={`Hero block - ${metadata.title}`} className="w-full h-auto rounded-2xl" />


              <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent mix-blend-color-burn"></div>

            </div>
          </div>

        )}
        <Markdown
          remarkPlugins={[remarkGfm, remarkNostr]}
          rehypePlugins={[rehypeRaw]} // Enables HTML <video> parsing
          urlTransform={(url) => {
            if (url.startsWith('nostr:')) {
              return url.slice(6) // Remove 'nostr:' prefix for rendering
            }
            return url
          }}
          components={markdownComponents}
        >
          {displayEvent.content}
        </Markdown>
        {metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {metadata.tags.map((tag) => (
              <div
                key={tag}
                title={tag}
                className="flex max-w-44 cursor-pointer items-center rounded-full bg-muted px-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  push(toNoteList({ hashtag: tag, kinds: [kinds.LongFormArticle] }))
                }}
              >
                #<span className="truncate">{tag}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <HighlightButton onHighlight={handleHighlight} containerRef={contentRef} />
      <PostEditor
        highlightedText={selectedText}
        parentStuff={event}
        open={showHighlightEditor}
        setOpen={setShowHighlightEditor}
      />
    </>
  )
}
