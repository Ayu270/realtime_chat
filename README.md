# 🔐 Real-Time Encrypted Chat

A high-performance, real-time chat application built with **Next.js 15**, **ElysiaJS**, and **Redis**.  
This project demonstrates **end-to-end type safety** using **Eden Treaty** and **ultra-fast message delivery** via **Upstash Redis**.

---

## 🔗 Links

- **Live Demo:** https://realtime-chat-encrypt.vercel.app  
- **Author:** Kumar Ayush

---

## 🚀 Key Features

- **Real-time Communication**  
  Powered by Redis Pub/Sub for instant, low-latency message delivery.

- **End-to-End Type Safety**  
  Shares types between the Elysia backend and Next.js frontend using **Eden Treaty** — zero manual API typing or schema duplication.

- **Dynamic Room System**  
  Create and join private chat rooms instantly with unique identifiers.

- **Modern UI/UX**  
  Clean, responsive interface built with **Tailwind CSS** and **Lucide React icons**.

- **Edge-Ready Architecture**  
  Designed to run globally with minimal latency on **Vercel’s Edge Network**.

---

## 🛠️ Tech Stack

| Tool            | Purpose                                      |
|-----------------|----------------------------------------------|
| Next.js         | Frontend Framework (App Router)              |
| ElysiaJS        | High-performance Bun-ready Backend Engine    |
| Eden Treaty     | Type-safe Client–Server Communication        |
| Upstash Redis   | Serverless Database & Pub/Sub Messaging      |
| Tailwind CSS    | Utility-first Styling                        |

---

## 🏗️ Project Structure

```plaintext
├── src/
│   ├── app/
│   │   ├── api/[[...slugs]]/   # ElysiaJS Backend (The "Brain")
│   │   │   └── route.ts        # Main API entry point & shared types
│   │   ├── room/[roomId]/      # Real-time Chat Room UI
│   │   └── page.tsx            # Landing Page / Room Creation
│   ├── lib/
│   │   └── client.ts           # Eden Treaty Configuration (API Client)
│   ├── components/             # Reusable UI components
│   └── utils/                  # Helper functions
├── .env                        # Environment Secrets
└── tailwind.config.ts          # Styling Configuration
```
