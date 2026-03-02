from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from . import paystack
from .paystack import PaystackError
from .serializers import PaymentVerificationRequestSerializer, PaymentVerificationResponseSerializer
from .services import process_paystack_verification


class PaystackVerifyAPIView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        serializer = PaymentVerificationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        reference = serializer.validated_data["reference"]
        try:
            gateway_payload = paystack.verify_transaction(reference)
        except PaystackError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({"detail": "Unable to verify payment."}, status=status.HTTP_502_BAD_GATEWAY)

        paid, order = process_paystack_verification(reference, gateway_payload)

        response = PaymentVerificationResponseSerializer(
            {
                "paid": paid,
                "order_id": order.id if order else None,
            }
        )
        return Response(response.data, status=status.HTTP_200_OK)
