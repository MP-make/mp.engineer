from django.urls import path
from . import views

urlpatterns = [
    path('projects/', views.ProjectList.as_view(), name='project-list'),
    path('skills/', views.SkillList.as_view(), name='skill-list'),
    path('contact/', views.ContactList.as_view(), name='contact-list'),
]