import { AvatarProps } from '@radix-ui/react-avatar'

import User from '#models/user'
import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'name'> // todo)) add image too
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {/* {user.image ? (
        <AvatarImage alt="Picture" src={user.image} />
      ) : */}
      (
      <AvatarFallback>
        <span className="sr-only">{user.name}</span>
        <Icons.user className="w-4 h-4" />
      </AvatarFallback>
      )
    </Avatar>
  )
}
