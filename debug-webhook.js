const crypto = require('crypto');

// Test the exact payload from the user's curl
const payload = {
  "id": "6b7f691a-55c3-407e-8333-911498d72f35",
  "creation_date": 1765758713851,
  "event": "PURCHASE_APPROVED",
  "version": "2.0.0",
  "data": {
    "product": {
      "id": 6844335,
      "ucode": "93480b67-68ee-456a-afe8-b0b3f6619199",
      "name": "Kit Inteligencia Emocional",
      "warranty_date": "2025-12-21T00:00:00Z",
      "has_co_production": false,
      "is_physical_product": false
    },
    "affiliates": [
      {
        "affiliate_code": "",
        "name": ""
      }
    ],
    "buyer": {
      "email": "frederiquelisboa10@gmail.com",
      "name": "Psicologos U.",
      "first_name": "Psicologos",
      "last_name": "U.",
      "checkout_phone": "56976935002",
      "address": {
        "city": "Los Andes",
        "country": "Chile",
        "country_iso": "CL",
        "state": "Valparaiso",
        "neighborhood": "",
        "zipcode": "250000",
        "address": "Los Andes 12334",
        "number": "",
        "complement": ""
      },
      "document": "",
      "document_type": ""
    },
    "producer": {
      "name": "Frederique Augusto Lisboa",
      "document": "01745473157",
      "legal_nature": "Pessoa Física"
    },
    "commissions": [
      {
        "value": 0.68,
        "source": "MARKETPLACE",
        "currency_value": "USD"
      },
      {
        "value": 5.18,
        "source": "PRODUCER",
        "currency_value": "USD",
        "currency_conversion": {
          "converted_value": 28.07,
          "converted_to_currency": "BRL",
          "conversion_rate": 5.419698
        }
      }
    ],
    "purchase": {
      "approved_date": 1765758703000,
      "full_price": {
        "value": 6694,
        "currency_value": "CLP"
      },
      "price": {
        "value": 5625.21,
        "currency_value": "CLP"
      },
      "checkout_country": {
        "name": "Chile",
        "iso": "CL"
      },
      "order_bump": {
        "is_order_bump": false
      },
      "origin": {
        "sck": "332n23f3l7o",
        "xcod": "332n23f3l7o"
      },
      "original_offer_price": {
        "value": 6.18,
        "currency_value": "USD"
      },
      "order_date": 1765758698000,
      "status": "APPROVED",
      "transaction": "HP06308826321",
      "payment": {
        "installments_number": 1,
        "type": "CREDIT_CARD"
      },
      "offer": {
        "code": "ebp6k097",
        "name": "Kit Inteligencia Emocional"
      },
      "invoice_by": "SELLER",
      "subscription_anticipation_purchase": false,
      "is_funnel": false,
      "business_model": "A"
    }
  }
};

const payloadString = JSON.stringify(payload);
const secret = 'wmozIn6FBoaIU9TJEYwpzj27Jz9djc30527780';
const signature = crypto.createHmac('sha256', secret).update(payloadString).digest('hex');

console.log('=== WEBHOOK DEBUG ===');
console.log('Payload length:', payloadString.length);
console.log('Generated signature:', signature);
console.log('Secret (first 10 chars):', secret.substring(0, 10) + '...');

// Test the webhook endpoint
async function testWebhook() {
  try {
    const response = await fetch('http://localhost:3000/api/webhook/hotmart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hotmart-hottok': signature
      },
      body: payloadString
    });

    console.log('\n=== RESPONSE ===');
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    try {
      const jsonResponse = JSON.parse(responseText);
      console.log('Parsed JSON:', JSON.stringify(jsonResponse, null, 2));
    } catch (e) {
      console.log('Response is not valid JSON');
    }
    
  } catch (error) {
    console.error('Error testing webhook:', error);
  }
}

testWebhook();
