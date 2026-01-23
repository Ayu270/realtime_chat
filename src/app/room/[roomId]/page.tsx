"use client"

import { useUsername } from "@/hooks/use-username"
import { client } from "@/lib/client"
import { useRealtime } from "@/lib/realtime-client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { useParams, useRouter } from "next/navigation"
import { use, useEffect, useRef, useState } from "react"

function formatTimeRemaining(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

const Page = () => {
    const params = useParams()
    const roomId = params.roomId as string

    const router = useRouter()

    const { username } = useUsername()
    const [input, setInput] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    const [copyStatus, setCopyStatus] = useState("COPY")
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

    const { data: ttlData } = useQuery({
       queryKey: ["ttl", roomId],
       queryFn: async () => {
         const res = await client.room.ttl.get({ query: { roomId } })
         return res.data
       },
    })

    useEffect(() => {
         if (ttlData?.ttl !== undefined) 
          setTimeRemaining(ttlData.ttl)
    }, [ttlData])

    useEffect(() => {
      if (timeRemaining === null || timeRemaining < 0) return

      if (timeRemaining === 0) {
         router.push("/?destroyed=true")
         return
      }

      const interval = setInterval(() => {
         setTimeRemaining((prev) => {
           if (prev === null || prev <= 1) {
            clearInterval(interval)
            return 0
          }
         return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }, [timeRemaining, router])

    const { data: messages, refetch } = useQuery({
      queryKey: ["messages", roomId],
      queryFn: async () => {
        const res = await client.messages.get({ query: { roomId } })
        return res.data
      },
    })

    const { mutate: sendMessage, isPending } = useMutation
    ({
        mutationFn: async ({ text }: { text: string }) => {
        await client.messages.post({ sender: username, text }, { query: { roomId } })
        setInput("")
        },
     })

    useRealtime({
       channels: [roomId],
       events: ["chat.message", "chat.destroy"],
       onData: ({ event }) => {
         if (event === "chat.message") {
           refetch()
         }
         
         if (event === "chat.destroy") {
            router.push("/?destroyed=true")
         }
       },
    })

    const { mutate: destroyRoom } = useMutation({
       mutationFn: async () => {
         await client.room.delete(null, { query: { roomId } })
       },
    })

    const copyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopyStatus("COPIED!")
    setTimeout(() => setCopyStatus("COPY"), 2000)
  }

    return (
          <main className="flex flex-col h-screen max-h-screen overflow-hidden">
               <header className="border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/30">
                    <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                               <span className="text-xs text-zinc-500 uppercase">Room ID</span>
                               <div className="flex items-center gap-2">
                                    <span className="font-bold text-green-500">{roomId}</span>
                                    <button onClick={copyLink} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors">{copyStatus}</button>
                               </div> 
                          </div>
                          <div className="h-8 w-px bg-zinc-800" />
                          <div className="flex flex-col">
                              <span className="text-xs text-zinc-500 uppercase">Self-Destruct</span>
                              <span className={`text-sm font-bold flex items-center gap-2 ${timeRemaining !== null && timeRemaining < 60 ? "text-red-500" : "text-amber-500"}`}>
                                   {timeRemaining !== null ? formatTimeRemaining(timeRemaining) : "--:--"}
                              </span>
                          </div>
                    </div>

                    <button onClick={() => destroyRoom()} 
                       className="text-xs bg-zinc-800 hover:bg-red-600 px-3 py-1.5 rounded text-zinc-400 hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50">
                       <span className="group-hover:animate-pulse">💣</span>
                       DESTROY NOW
                    </button>
               </header>

               {/* Messages*/}
               <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                    {messages?.messages.length === 0 && (
                       <div className="flex items-center justify-center h-full">
                         <p className="text-zinc-600 text-sm font-mono">
                           No messages yet, start the conversation.
                         </p>
                       </div>
                    )}

                    {messages?.messages.map((msg) => (
                      <div key={msg.id} className="flex flex-col items-start">
                        <div className="max-w-[80%] group">
                          <div className="flex items-baseline gap-3 mb-1">
                            <span
                              className={`text-xs font-bold ${
                                msg.sender === username ? "text-green-500" : "text-blue-500"
                              }`}
                            >
                              {msg.sender === username ? "YOU" : msg.sender}
                            </span>

                            <span className="text-[10px] text-zinc-600">
                              {format(msg.timestamp, "HH:mm")}
                            </span>
                          </div>
            
                          <p className="text-sm text-zinc-300 leading-relaxed break-all">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    ))}
               </div>

               <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
                    <div className="flex gap-4">
                         <div className="flex-1 relative group">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">
                                {">"}
                              </span>
                              <input 
                                autoFocus
                                type="text"
                                value={input}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && input.trim()) {
                                    sendMessage({ text: input })
                                    inputRef.current?.focus()
                                  }
                                }}
                                placeholder="Type message..."
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm"
                              />
                         </div>
                         <button onClick={() => {
                              sendMessage({ text: input })
                              inputRef.current?.focus()
                            }}
                            disabled={!input.trim() || isPending} 
                            className="bg-zinc-800 text-zinc-400 px-6 text-sm font-bold hover:text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                         >
                            SEND
                         </button>
                    </div>
               </div>
          </main>
    )
}

export default Page
