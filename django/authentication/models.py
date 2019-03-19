from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
)


class UserManager(BaseUserManager):
    def create_user(self, **kwargs):
        if 'email' not in kwargs:
            raise ValueError("Users must have an email address")
        if 'password' not in kwargs:
            raise ValueError("Users must have a password")
        if 'first_name' not in kwargs:
            raise ValueError("Users must have a first name")
        if 'second_name' not in kwargs:
            raise ValueError("Users must have a second name")

        model_kwargs = {k: v for k, v in kwargs.items() if k != 'password'}
        model_kwargs['email'] = self.normalize_email(model_kwargs['email'])

        user = self.model(**model_kwargs)
        user.set_password(kwargs['password'])
        user.save()
        return user

    def create_superuser(self, **kwargs):
        user = self.create_user(**kwargs)
        user.is_admin = True
        user.save()
        return user


class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=32)
    second_name = models.CharField(max_length=32)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'second_name']

    def __str__(self):
        return '{first_name} {second_name} <{email}>'.format(
            first_name=self.first_name,
            second_name=self.second_name,
            email=self.email,
        )

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        return True

    @property
    def is_staff(self):
        return self.is_admin
