import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetchProfile } from '@/hooks'
import { toProfile } from '@/lib/link'
import { cn, isTouchDevice } from '@/lib/utils'
import { SecondaryPageLink } from '@/PageManager'
import { useMemo } from 'react'
import ProfileCard from '../ProfileCard'
import TextWithEmojis from '../TextWithEmojis'

export default function Username({
  userId,
  showAt = false,
  className,
  skeletonClassName,
  withoutSkeleton = false,
  specFont
}: {
  userId: string
  showAt?: boolean
  className?: string
  skeletonClassName?: string
  withoutSkeleton?: boolean
  specFont?: boolean
}) {
  const { profile, isFetching } = useFetchProfile(userId)
  const supportTouch = useMemo(() => isTouchDevice(), [])
  if (!profile && isFetching && !withoutSkeleton) {
    return (
      <div className="py-1">
        <Skeleton className={cn('w-16', skeletonClassName)} />
      </div>
    )
  }
  if (!profile) return null
  const trigger = (
    <div dir="auto" className={className}>
      <SecondaryPageLink
        to={toProfile(userId)}
        className={cn('truncate')}
        onClick={(e) => e.stopPropagation()}
      >
        {showAt && '@'}
        <TextWithEmojis text={profile.username} emojis={profile.emojis} emojiClassName="mb-1" useFallbackFont={!!specFont} />
      </SecondaryPageLink>
    </div>
  )

  if (supportTouch) {
    return trigger
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <ProfileCard userId={userId} />
      </HoverCardContent>
    </HoverCard>
  )
}

export function SimpleUsername({
  userId,
  showAt = false,
  className,
  skeletonClassName,
  withoutSkeleton = false,
  specFont
}: {
  userId: string
  showAt?: boolean
  className?: string
  skeletonClassName?: string
  withoutSkeleton?: boolean
  specFont?: boolean
}) {
  const { profile, isFetching } = useFetchProfile(userId)
  if (!profile && isFetching && !withoutSkeleton) {
    return (
      <div className="py-1">
        <Skeleton className={cn('w-16', skeletonClassName)} />
      </div>
    )
  }
  if (!profile) return null

  const { username, emojis } = profile
  return (
    <div dir="auto" className={cn(className)}>
      {showAt && '@'}
      <TextWithEmojis text={username} emojis={emojis} emojiClassName="mb-1" useFallbackFont={!!specFont} />
    </div>
  )
}
