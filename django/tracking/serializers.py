from rest_framework import serializers

from .models import Tag, Activity


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name')
        read_only_fields = ('id',)


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ('id', 'name', 'start', 'end', 'tags')
        read_only_fields = ('id',)

    def validate_tags(self, tags):
        for tag in tags:
            if tag.user_id != self.context['request'].user.id:
                raise serializers.ValidationError(
                    "One of the tags doesn't exist"
                )
        return tags

    def validate(self, data):
        if 'end' in data and data['end'] is not None:
            if data['end'] <= data['start']:
                raise serializers.ValidationError({
                    'end': "End should be greater than start"
                })
        return data
