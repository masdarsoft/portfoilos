from rest_framework import serializers
from .models.category import ServiceCategory
from .models.gallery import CategoryGallery
from .models.review import ServiceReview


class CategoryGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryGallery
        fields = ["id", "image", "caption", "display_order"]
        read_only_fields = fields


class ServiceReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceReview
        fields = ["id", "reviewer_name", "city", "rating", "text", "review_date"]
        read_only_fields = fields


class ServiceCategorySerializer(serializers.ModelSerializer):
    gallery_images = CategoryGallerySerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = ServiceCategory
        fields = [
            "id",
            "slug",
            "title",
            "seo_title",
            "description",
            "seo_description",
            "seo_keywords",
            "main_image",
            "icon",
            "features",
            "blog_content",
            "display_order",
            "is_active",
            "gallery_images",
            "reviews",
        ]
        read_only_fields = fields

    def get_reviews(self, obj):
        # Only return visible reviews
        visible_reviews = obj.reviews.filter(is_visible=True)
        return ServiceReviewSerializer(visible_reviews, many=True).data
