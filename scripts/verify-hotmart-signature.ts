#!/usr/bin/env tsx
/**
 * Script para verificar a assinatura HMAC do webhook da Hotmart
 * Este script ajuda a debugar problemas de validação de assinatura
 */

import './load-env'
import crypto from 'crypto'

const WEBHOOK_SECRET = process.env.HOTMART_WEBHOOK_SECRET || 'wmozIn6FBoaIU9TJEYwpzj27Jz9djc30527780'

// Payload real enviado pela Hotmart (do erro que você compartilhou)
const realPayload = {
  "id": "a5388a2e-a63e-4f87-93fc-d4473a2334ad",
  "creation_date": 1766148684314,
  "event": "PURCHASE_APPROVED",
  "version": "2.0.0",
  "data": {
    "product": {
      "id": 0,
      "ucode": "fb056612-bcc6-4217-9e6d-2a5d1110ac2f",
      "name": "Produto test postback2",
      "warranty_date": "2017-12-27T00:00:00Z",
      "support_email": "support@hotmart.com.br",
      "has_co_production": false,
      "is_physical_product": false,
      "content": {
        "has_physical_products": true,
        "products": [
          {
            "id": 4774438,
            "ucode": "559fef42-3406-4d82-b775-d09bd33936b1",
            "name": "How to Make Clear Ice",
            "is_physical_product": false
          },
          {
            "id": 4999597,
            "ucode": "099e7644-b7d1-43d6-82a9-ec6be0118a4b",
            "name": "Organizador de Poeira",
            "is_physical_product": true
          }
        ]
      }
    },
    "affiliates": [
      {
        "affiliate_code": "Q58388177J",
        "name": "Affiliate name"
      }
    ],
    "buyer": {
      "email": "testeComprador271101postman15@example.com",
      "name": "Teste Comprador",
      "first_name": "Teste",
      "last_name": "Comprador",
      "checkout_phone_code": "999999999",
      "checkout_phone": "99999999900",
      "address": {
        "city": "Uberlândia",
        "country": "Brasil",
        "country_iso": "BR",
        "state": "Minas Gerais",
        "neighborhood": "Tubalina",
        "zipcode": "38400123",
        "address": "Avenida Francisco Galassi",
        "number": "10",
        "complement": "Perto do shopping"
      },
      "document": "69526128664",
      "document_type": "CPF"
    },
    "producer": {
      "name": "Producer Test Name",
      "document": "12345678965",
      "legal_nature": "Pessoa Física"
    },
    "commissions": [
      {
        "value": 149.5,
        "source": "MARKETPLACE",
        "currency_value": "BRL"
      },
      {
        "value": 1350.5,
        "source": "PRODUCER",
        "currency_value": "BRL"
      }
    ],
    "purchase": {
      "approved_date": 1511783346000,
      "full_price": {
        "value": 1500,
        "currency_value": "BRL"
      },
      "price": {
        "value": 1500,
        "currency_value": "BRL"
      },
      "checkout_country": {
        "name": "Brasil",
        "iso": "BR"
      },
      "order_bump": {
        "is_order_bump": true,
        "parent_purchase_transaction": "HP02316330308193"
      },
      "event_tickets": {
        "amount": 1766148684289
      },
      "original_offer_price": {
        "value": 1500,
        "currency_value": "BRL"
      },
      "order_date": 1511783344000,
      "status": "APPROVED",
      "transaction": "HP16015479281022",
      "payment": {
        "installments_number": 12,
        "type": "CREDIT_CARD"
      },
      "offer": {
        "code": "test",
        "coupon_code": "SHHUHA"
      },
      "sckPaymentLink": "sckPaymentLinkTest",
      "is_funnel": false,
      "business_model": "I"
    },
    "subscription": {
      "status": "ACTIVE",
      "plan": {
        "id": 123,
        "name": "plano de teste"
      },
      "subscriber": {
        "code": "I9OT62C3"
      }
    }
  }
}

function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
}

console.log('═══════════════════════════════════════════════════════════')
console.log('HOTMART WEBHOOK SIGNATURE VERIFICATION')
console.log('═══════════════════════════════════════════════════════════\n')

console.log(`Webhook Secret: ${WEBHOOK_SECRET.substring(0, 10)}...\n`)

// Testar diferentes formatações do JSON
const variations = [
  { name: 'JSON.stringify (default)', payload: JSON.stringify(realPayload) },
  { name: 'JSON.stringify (no spaces)', payload: JSON.stringify(realPayload, null, 0) },
  { name: 'JSON.stringify (2 spaces)', payload: JSON.stringify(realPayload, null, 2) },
  { name: 'JSON.stringify (tab)', payload: JSON.stringify(realPayload, null, '\t') },
]

console.log('Testing different JSON formatting variations:\n')

variations.forEach((variation, index) => {
  const signature = generateSignature(variation.payload, WEBHOOK_SECRET)
  console.log(`${index + 1}. ${variation.name}`)
  console.log(`   Signature: ${signature}`)
  console.log(`   Payload length: ${variation.payload.length} chars`)
  console.log(`   First 100 chars: ${variation.payload.substring(0, 100)}...`)
  console.log()
})

console.log('\n═══════════════════════════════════════════════════════════')
console.log('IMPORTANT NOTES:')
console.log('═══════════════════════════════════════════════════════════')
console.log('1. Hotmart sends the signature in the "x-hotmart-hottok" header')
console.log('2. The signature is calculated on the RAW JSON body')
console.log('3. You must validate the signature BEFORE parsing the JSON')
console.log('4. Compare the signature from Hotmart with the ones above')
console.log('\nIf none match, the WEBHOOK_SECRET might be incorrect.')
console.log('Check your Hotmart dashboard for the correct secret.')
