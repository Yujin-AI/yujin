import { useForm } from '@inertiajs/react'
import React from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

// export type CreateChatbotDialogProps = {
//   open: boolean
//   setOpen: (open: boolean) => void
// }

export default function CreateChatbotDialog() {
  const form = useForm({
    name: '',
    url: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post('/chatbots', {
      // onSuccess: () => {
      //   setOpen(false)
      // },
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Chatbot</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] gap-0">
        <DialogHeader>
          <DialogTitle>New Chatbot</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 px-6 py-4 pt-0">
            <div className="grid gap-1">
              <Label>Chatbot Name</Label>

              <Input
                id="name"
                className="!col-span-3 w-full"
                value={form.data.name}
                placeholder="AdonisJS Chatbot"
                onChange={(e) => form.setData('name', e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 px-6 py-4 pt-0">
            <div className="grid gap-1">
              <Label>Website URL</Label>

              <Input
                id="url"
                className="!col-span-3 w-full"
                value={form.data.url}
                placeholder="https://docs.adonisjs.com"
                onChange={(e) => form.setData('url', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" loading={form.processing}>
                <span>Create new Chatbot</span>
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
