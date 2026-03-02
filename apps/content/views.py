from django.shortcuts import get_object_or_404, render

from .models import BlogPost, Resource


def blog_list(request):
    posts = BlogPost.objects.filter(is_published=True)
    return render(request, "content/blog_list.html", {"posts": posts})


def blog_detail(request, slug: str):
    post = get_object_or_404(BlogPost, slug=slug, is_published=True)
    return render(request, "content/blog_detail.html", {"post": post})


def resource_list(request):
    resources = Resource.objects.filter(is_published=True)
    return render(request, "content/resource_list.html", {"resources": resources})
