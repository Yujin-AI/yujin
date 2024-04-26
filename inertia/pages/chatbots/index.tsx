import { InferPageProps } from '@adonisjs/inertia/types'
import { Link } from '@inertiajs/react'

import ChatbotController from '#controllers/chatbot_controller'
import CreateChatbotDialog from '@/components/create_chatbot'
import { Icons } from '@/components/icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function ChatbotsIndex(props: InferPageProps<ChatbotController, 'index'>) {
  const { chatbots, defaultChatbotId } = props
  return (
    <div className="flex flex-col items-center gap-10 mt-10">
      <div className="flex justify-between gap-96">
        <h1 className="text-2xl">Chatbots</h1>

        <CreateChatbotDialog />
      </div>
      <div className="flex flex-wrap gap-2">
        {chatbots.map((chatbot) => (
          <Card key={chatbot.id} className="">
            <CardHeader>
              <CardTitle>
                <Link href={chatbot.slug}>{chatbot.name}</Link>
              </CardTitle>
              <CardDescription>
                <a href={chatbot.url} target="_blank" rel="noreferrer">
                  {chatbot.url}
                </a>
              </CardDescription>
            </CardHeader>
            {/* <CardContent>
            <p>Card Content</p>
          </CardContent> */}
            <CardFooter className="flex justify-center gap-1">
              {/* <Button>Select as Default</Button> */}
              {defaultChatbotId === chatbot.id ? (
                <Button variant="outline" disabled>
                  Default
                </Button>
              ) : (
                <Link
                  as="button"
                  className={cn(buttonVariants({ variant: 'default' }))}
                  href="/chatbots/select"
                  method="put"
                  data={{ chatbotId: chatbot.id }}
                >
                  Set Default
                </Link>
              )}
              <Link
                href={'chatbots/' + chatbot.slug}
                className={cn(buttonVariants({ variant: 'destructive' }))}
                method="delete"
              >
                <Icons.trash />
              </Link>
            </CardFooter>
            {/* <li key={chatbot.id}>{chatbot.name}</li> */}
          </Card>
        ))}
      </div>
    </div>
  )
}
