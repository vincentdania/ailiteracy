from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

class PaystackVerifyAPIView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        return Response(
            {"detail": "Payment verification is disabled on this site. Ecommerce is handled by hyrax.ng."},
            status=status.HTTP_410_GONE,
        )
