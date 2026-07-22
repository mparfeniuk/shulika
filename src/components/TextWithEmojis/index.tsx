import { EmbeddedEmojiParser, parseContent } from '@/lib/content-parser';
import { formatTextWithFontFallback } from '@/lib/utils';
import { TEmoji } from '@/types';
import { useMemo } from 'react';
import Emoji from '../Emoji';

/**
 * Component that renders text with custom emojis replaced by emoji images
 * According to NIP-30, custom emojis are defined in emoji tags and referenced as :shortcode: in text
 */
export default function TextWithEmojis({
  text,
  emojis,
  className,
  emojiClassName,
  useFallbackFont
}: {
  text: string
  emojis?: TEmoji[]
  className?: string
  emojiClassName?: string
  useFallbackFont?: boolean
}) {
  const nodes = useMemo(() => {
    if (!emojis || emojis.length === 0) {
      return [{ type: 'text' as const, data: text }]
    }

    // Use the existing content parser infrastructure
    return parseContent(text, [EmbeddedEmojiParser])
  }, [text, emojis])

  // Create emoji map for quick lookup
  const emojiMap = useMemo(() => {
    const map = new Map<string, TEmoji>()
    emojis?.forEach((emoji) => {
      map.set(emoji.shortcode, emoji)
    })
    return map
  }, [emojis])

  return (
    <span dir="auto" className={className}>
      {nodes.map((node, index) => {
        if (node.type === 'text') {
          return useFallbackFont ?
            formatTextWithFontFallback(
              node.data,
              {
                fontClass: 'agnostric-decor-text',
                fallbackFontClass: 'font-cormorant font-semibold'
              }) : node.data
        }
        if (node.type === 'emoji') {
          const shortcode = node.data.split(':')[1]
          const emoji = emojiMap.get(shortcode)
          if (!emoji) return node.data
          return <Emoji key={index} emoji={emoji} classNames={{ img: emojiClassName }} />
        }
        return null
      })}
    </span>
  )
}
