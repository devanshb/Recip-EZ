from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth.models import User, default_token_generator
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from .models import PasswordResetRequest
from django.contrib.auth import authenticate
  
# added March 18 for password reset request + search bar
from django.contrib.auth.tokens import default_token_generator
from .models import Product
from django.db.models import Q
from .serializers import ProductSerializer



class SignUpView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, email=email)

        user = authenticate(username=username, password=password)
        if user is not None:
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Failed to authenticate user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

  
class HomeView(APIView):
    permission_classes = (IsAuthenticated, )
  
    def get(self, request):
        content = {'message': 'Welcome to RECIP-EZ!'}
        return Response(content)



class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class ForgotPasswordView(APIView):
    def post(self, request):
        username = request.data.get('username')
        if username:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
            reset_request = PasswordResetRequest.objects.create(
                user=user,
                expires_at=timezone.now() + timezone.timedelta(hours=1)
            )

            reset_link = f'http://example.com/reset-password?token={reset_request.token}'
            email_content = render_to_string('password_reset_email.html', {'reset_link': reset_link})
            send_mail('Password Reset', email_content, 'from@example.com', [user.email])
            
            return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    def post(self, request):
        token = request.data.get('token')
        password = request.data.get('password')

        if token and password:
            try:
                reset_request = PasswordResetRequest.objects.get(token=token, expires_at__gte=timezone.now())
            except PasswordResetRequest.DoesNotExist:
                return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
            
            user = reset_request.user
            user.set_password(password)
            user.save()

            reset_request.delete()  # Delete the reset request

            return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Token and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        

# March 18:
# 2 classes added below for password reset request

class PasswordResetRequestView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()
        if user is not None:
            token = default_token_generator.make_token(user)
            reset_link = f"http://frontend-url/reset-password/{user.pk}/{token}"
            send_mail(
                'Password Reset Request',
                f'Please use the following link to reset your password: {reset_link}',
                'from@example.com',
                [email],
                fail_silently=False,
            )
            return Response({"message": "Password reset email sent."}, status=status.HTTP_200_OK)
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class PasswordResetView(APIView):
    def post(self, request, uidb64, token, *args, **kwargs):
        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            password = request.data.get("password")
            user.set_password(password)
            user.save()
            return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid token or user ID."}, status=status.HTTP_400_BAD_REQUEST)
    



class SearchView(APIView):
    def get(self, request):
        query = request.query_params.get('query', '')
        products = Product.objects.filter(Q(name__icontains=query) | Q(description__icontains=query))
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

