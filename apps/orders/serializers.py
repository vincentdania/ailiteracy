from rest_framework import serializers


class PaymentVerificationRequestSerializer(serializers.Serializer):
    reference = serializers.CharField(max_length=120)


class PaymentVerificationResponseSerializer(serializers.Serializer):
    paid = serializers.BooleanField()
    order_id = serializers.IntegerField(allow_null=True)
