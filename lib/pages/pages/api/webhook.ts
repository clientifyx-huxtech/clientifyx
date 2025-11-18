import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { supabase } from '../../lib/supabase'

const WA_TOKEN = process.env.WA_TOKEN
const WA_PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID
const DEFAULT_BUSINESS_ID = process.env.DEFAULT_BUSINESS_ID
const WA_VERIFY_TOKEN = process.env.WA_VERIFY_TOKEN || 'verify-token'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'] as string
    const token = req.query['hub.verify_token'] as string
    const challenge = req.query['hub.challenge'] as string
    if (token && token === WA_VERIFY_TOKEN) return res.status(200).send(challenge || 'ok')
    return res.status(400).send('verification failed')
  }

  if (req.method !== 'POST') return res.status(200).send('ok')

  try {
    const body = req.body
    const messages = body?.entry?.[0]?.changes?.[0]?.value?.messages
    if (!messages || messages.length === 0) return res.status(200).json({ ok: true, note: 'no messages' })

    const message = messages[0]
    const wa_from = message.from
    const text = message?.text?.body || ''
    const name = message?.profile?.name || ''

    const { error: insertError } = await supabase.from('leads').insert([{
      business_id: DEFAULT_BUSINESS_ID,
      wa_phone: wa_from,
      name,
      message: text,
      status: 'new'
    }])
    if (insertError) console.error('Insert lead error', insertError)

    const { data: templates } = await supabase.from('templates').select('*').eq('business_id', DEFAULT_BUSINESS_ID)

    let reply = process.env.DEFAULT_REPLY_MESSAGE || `Hi ${name || ''}! Thanks for contacting ${process.env.BUSINESS_NAME || 'ClientifyX'}. We'll respond shortly.`

    if (templates && templates.length) {
      const txt = (text || '').toLowerCase()
      for (const t of templates as any[]) {
        const keys = t.trigger_keywords || []
        if (keys.some((k: string) => txt.includes(k.toLowerCase()))) {
          reply = t.reply_text
          break
        }
      }
    }

    if (WA_TOKEN && WA_PHONE_NUMBER_ID) {
      try {
        const url = `https://graph.facebook.com/v16.0/${WA_PHONE_NUMBER_ID}/messages`
        await axios.post(url, {
          messaging_product: 'whatsapp',
          to: wa_from,
          text: { body: reply }
        }, { headers: { Authorization: `Bearer ${WA_TOKEN}` } })
      } catch (sendErr) {
        console.error('WA send error', sendErr?.response?.data || sendErr.message)
      }
    } else {
      console.log('WA token/phone id missing — reply not sent. Reply would be:', reply)
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('webhook error', err)
    return res.status(500).json({ error: 'internal' })
  }
}
