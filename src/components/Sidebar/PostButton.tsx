import PostEditor from '@/components/PostEditor'
import { useNostr } from '@/providers/NostrProvider'
import { useState } from 'react'
import SidebarItem from './SidebarItem'

export default function PostButton({ collapse }: { collapse: boolean }) {
  const { checkLogin } = useNostr()
  const [open, setOpen] = useState(false)

  return (
    <div className="pt-4">
      <SidebarItem
        title="New post"
        description="Post"
        onClick={(e) => {
          e.stopPropagation()
          checkLogin(() => {
            setOpen(true)
          })
        }}
        variant="default"
        collapse={collapse}
        newPostItem
      >
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor"
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <line x1="16" y1="8" x2="2" y2="22" />
        <line x1="17.5" y1="15" x2="9" y2="15" />
      </svg>
      </SidebarItem>
      <PostEditor open={open} setOpen={setOpen} />
    </div>
  )
}
