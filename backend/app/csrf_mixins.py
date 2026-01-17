from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect


class CSRFEnforcedViewSetMixin:
    def initial(self, request, *args, **kwargs):
        if request.method not in ("GET", "HEAD", "OPTIONS"):
            csrf_protect(request)
        return super().initial(request, *args, **kwargs)

    @method_decorator(ensure_csrf_cookie)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(ensure_csrf_cookie)
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class CSRFEnforcedAPIViewMixin:
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        if hasattr(super(), "get"):
            return super().get(request, *args, **kwargs)
        return self.http_method_not_allowed(request, *args, **kwargs)

    @method_decorator(ensure_csrf_cookie)
    def head(self, request, *args, **kwargs):
        if hasattr(super(), "head"):
            return super().head(request, *args, **kwargs)
        return self.http_method_not_allowed(request, *args, **kwargs)

    @method_decorator(csrf_protect)
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    @method_decorator(csrf_protect)
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @method_decorator(csrf_protect)
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @method_decorator(csrf_protect)
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)
