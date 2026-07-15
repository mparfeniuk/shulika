import { usePrimaryPage } from '@/PageManager'
import SidebarItem from './SidebarItem'

export default function SearchButton({ collapse }: { collapse: boolean }) {
  const { navigate, current, display } = usePrimaryPage()
  const active = current === 'search' && display

  return (
    <SidebarItem
      title="Search"
      onClick={() => navigate('search')}
      active={active}
      collapse={collapse}
    >
    </SidebarItem>
  )
}
