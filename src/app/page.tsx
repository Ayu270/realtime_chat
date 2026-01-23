"use client"

import { useMutation } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useUsername } from "@/hooks/use-username"
import { Suspense } from "react"

const Page = () => {
  return (
    <Suspense>
      <Lobby />
    </Suspense>
  )
}

export default Page


function Lobby() {
  const { username } = useUsername()
  const router = useRouter()

  const searchParams = useSearchParams()
  const wasDestroyed = searchParams.get("destroyed") === "true"
  const error = searchParams.get("error")


  const { mutate: createRoom } = useMutation ({
      mutationFn: async () => {
            const res = await client.room.create.post()

            if (res.status === 200) {
              router.push(`/room/${res.data?.roomId}`)
            }
      },
  })

  return <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">

         {wasDestroyed && (
           <div className="bg-red-950/50 border border-red-900 p-4 text-center">
              <p className="text-red-500 text-sm font-bold">ROOM DESTROYED</p>
              <p className="text-zinc-500 text-xs mt-1">
                 All messages were permanently deleted.
              </p>
           </div>
         )}
         {error === "room-not-found" && (
            <div className="bg-red-950/50 border border-red-900 p-4 text-center">
               <p className="text-red-500 text-sm font-bold">ROOM NOT FOUND</p>
               <p className="text-zinc-500 text-xs mt-1">
                  This room may have expired or never existed.
               </p>
            </div>
         )}
         {error === "room-full" && (
            <div className="bg-red-950/50 border border-red-900 p-4 text-center">
               <p className="text-red-500 text-sm font-bold">ROOM FULL</p>
               <p className="text-zinc-500 text-xs mt-1">
                  This room is at maximum capacity.
               </p>
            </div>
         )}

         <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-green-500">
               {">"}private_chat
            </h1>
            <p className="text-zinc-500 text-sm">
               A private, self-destructing chat room.
            </p>
         </div>
          <div className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
              <div className="space-y-5">
                  <div className="space-y-2">
                     <label className="flex items-center text-zinc-500">Your Identity</label>
                     <div className="flex items-center gap-3">
                        <div className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-400 font-mono">
                           {username}
                        </div>
                     </div>
                  </div>

                  <button 
                     onClick={() => createRoom()}
                     className="w-full bg-zinc-100 text-black p-3 text-sm font-bold hover:bg-zinc-50 hover:text-black transition-colors mt-2 cursor-pointer disabled:opacity-50">
                     CREATE SECURE ROOM
                  </button>
              </div>
          </div>
      </div>
  </main>
}
