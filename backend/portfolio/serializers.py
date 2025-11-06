from rest_framework import serializers
from .models import Project, Skill, Contact

class ProjectSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'images', 'link', 'technologies', 'status', 'created_at']

    def get_images(self, obj):
        return [img.image.url for img in obj.project_images.all()]

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'