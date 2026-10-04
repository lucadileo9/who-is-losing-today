import { Avatar, Badge } from "@/components/atoms"

export function ProfileHeader() {
  return (
    <div className="flex items-center gap-4">
      <Avatar initials="LR" />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Luca Rossi</h1>
        <p className="text-sm text-muted-foreground">Membro dal 2024</p>
      </div>
      <Badge variant="secondary">Giocatore</Badge>
    </div>
  )
}
