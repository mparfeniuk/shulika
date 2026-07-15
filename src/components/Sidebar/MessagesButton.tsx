import { useDmUnread } from '@/hooks/useDmUnread'
import { usePrimaryPage } from '@/PageManager'
import { useNostr } from '@/providers/NostrProvider'
import SidebarItem from './SidebarItem'

export default function MessagesButton({ collapse }: { collapse: boolean }) {
  const { checkLogin } = useNostr()
  const { navigate, current, display } = usePrimaryPage()
  const { hasUnread } = useDmUnread()
  const active = display && current === 'dms'

  return (
    <SidebarItem
      title="Messages"
      onClick={() => checkLogin(() => navigate('dms'))}
      active={active}
      collapse={collapse}
    >
        {hasUnread && (
            <div className="bg-primary ring-background absolute left-0 h-2 w-2 rounded-full ring-2" />
        )}
      
    </SidebarItem>
  )
}
