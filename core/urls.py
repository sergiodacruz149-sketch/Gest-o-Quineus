from django.contrib import admin
from django.urls import path
from django.shortcuts import render

# Função que vai abrir o teu site vindo do React
def index(request):
    return render(request, 'index.html')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index), # Página inicial do Instituto Quineus
]
