import hashlib
import hmac
from decimal import Decimal
from typing import Any, Dict, Optional
from uuid import uuid4

import requests
from django.conf import settings

PAYSTACK_BASE_URL = "https://api.paystack.co"


class PaystackError(Exception):
    pass


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json",
    }


def initialize_transaction(
    order, email: str, callback_url: Optional[str] = None
) -> Dict[str, Any]:
    if not settings.PAYSTACK_SECRET_KEY:
        raise PaystackError("Paystack secret key is not configured.")

    reference = f"order-{order.id}-{uuid4().hex[:10]}"
    payload = {
        "email": email,
        "amount": int(Decimal(order.total_amount) * 100),
        "currency": order.currency,
        "reference": reference,
        "callback_url": callback_url or settings.PAYSTACK_CALLBACK_URL,
        "metadata": {
            "order_id": order.id,
            "user_id": order.user_id,
        },
    }

    response = requests.post(
        f"{PAYSTACK_BASE_URL}/transaction/initialize",
        headers=_headers(),
        json=payload,
        timeout=20,
    )
    response.raise_for_status()
    return response.json()


def verify_transaction(reference: str) -> Dict[str, Any]:
    if not settings.PAYSTACK_SECRET_KEY:
        raise PaystackError("Paystack secret key is not configured.")

    response = requests.get(
        f"{PAYSTACK_BASE_URL}/transaction/verify/{reference}",
        headers=_headers(),
        timeout=20,
    )
    response.raise_for_status()
    return response.json()


def verify_webhook_signature(payload: bytes, signature: Optional[str]) -> bool:
    if not signature:
        return False

    secret = settings.PAYSTACK_WEBHOOK_SECRET or settings.PAYSTACK_SECRET_KEY
    computed = hmac.new(secret.encode("utf-8"), payload, hashlib.sha512).hexdigest()
    return hmac.compare_digest(computed, signature)
