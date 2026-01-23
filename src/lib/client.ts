import { treaty } from '@elysiajs/eden'
import type { App } from '../app/api/[[...slugs]]/route'

const domain = process.env.NEXT_PUBLIC_DOMAIN || 
               (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')

export const client = treaty<App>(domain).api
