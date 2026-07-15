import { usePrimaryPage } from '@/PageManager'
import { useNostr } from '@/providers/NostrProvider'
import { useNotification } from '@/providers/NotificationProvider'
import SidebarItem from './SidebarItem'

export default function NotificationsButton({ collapse }: { collapse: boolean }) {
  const { checkLogin } = useNostr()
  const { navigate, current, display } = usePrimaryPage()
  const { hasNewNotification } = useNotification()
  const active = display && current === 'notifications'

  return (
    <SidebarItem
      title="Notifications"
      onClick={() => checkLogin(() => navigate('notifications'))}
      active={active}
      collapse={collapse}
    >
        {hasNewNotification && (
          <div className="bg-primary ring-background absolute left-0 h-2 w-2 rounded-full ring-2" />
        )}
    </SidebarItem>
  )
}
