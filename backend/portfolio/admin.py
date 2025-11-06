from django.contrib import admin
from .models import Project, Contact, ProjectImage

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1

class ProjectAdmin(admin.ModelAdmin):
    inlines = [ProjectImageInline]

# Register your models here.
admin.site.register(Project, ProjectAdmin)
admin.site.register(Contact)
