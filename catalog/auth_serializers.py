from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    default_error_messages = {
        'invalid_credentials': 'Неверный логин или пароль.',
    }

    def validate(self, attrs):
        login = attrs['login'].strip()
        password = attrs['password']

        user = User.objects.filter(username__iexact=login).first()
        if user is None and '@' in login:
            user = User.objects.filter(email__iexact=login).first()

        if user is None:
            raise serializers.ValidationError(
                self.error_messages['invalid_credentials'],
            )

        authenticated_user = authenticate(username=user.username, password=password)
        if authenticated_user is None:
            raise serializers.ValidationError(
                self.error_messages['invalid_credentials'],
            )

        refresh = RefreshToken.for_user(authenticated_user)
        attrs['user'] = authenticated_user
        attrs['access'] = str(refresh.access_token)
        attrs['refresh'] = str(refresh)
        return attrs


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        trim_whitespace=False,
    )
    password_confirm = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    def validate_username(self, value: str) -> str:
        username = value.strip()
        if not username:
            raise serializers.ValidationError('Укажите имя пользователя.')
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError(
                'Пользователь с таким именем уже существует.',
            )
        return username

    def validate_email(self, value: str) -> str:
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                'Пользователь с таким email уже существует.',
            )
        return email

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {'password_confirm': 'Пароли не совпадают.'},
            )
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
