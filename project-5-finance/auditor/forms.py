from django import forms  
from django.contrib.auth.forms import UserCreationForm  
from django.core.exceptions import ValidationError  
from django.forms.fields import EmailField  
from django.forms.forms import Form  
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm

from django.contrib.auth import get_user_model
User = get_user_model()

class SignUpForm(UserCreationForm):
	username = forms.CharField(label='username', min_length=5, max_length=150)  
	email = forms.EmailField(label='email')  
	password1 = forms.CharField(label='password', min_length=5, widget=forms.PasswordInput)  
	password2 = forms.CharField(label='Confirm password',min_length=5,  widget=forms.PasswordInput)

	class Meta:
		model = User
		fields = ("username", "email", "password1", "password2")

	def username_clean(self):  
		username = self.cleaned_data['username'].lower()  
		new = User.objects.filter(username = username)  
		if new.count():  
			raise ValidationError("User Already Exist")  
		return username  

	def email_clean(self):  
		email = self.cleaned_data['email'].lower()  
		new = User.objects.filter(email=email)  
		if new.count():  
			raise ValidationError(" Email Already Exist")  
		return email  
	
	def clean_password2(self):  
		password1 = self.cleaned_data['password1']  
		password2 = self.cleaned_data['password2']  
  
		if password1 and password2 and password1 != password2:  
			raise ValidationError("Password don't match")  
		return password2  

	def save(self, commit=True):
		user = super(SignUpForm, self).save(commit=False)
		user.email = self.cleaned_data['email']
		if commit:
			user.save()
		return user
	



class SignInForm(AuthenticationForm):
	class Meta:
		fields = ("username", "password1")