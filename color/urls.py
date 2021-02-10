from django.conf.urls import url
from color import views

urlpatterns = [
    url(r"^$", views.main, name="main"),
]
