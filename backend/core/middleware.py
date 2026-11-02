"""Middleware for the public content API."""


class ApiNoCacheMiddleware:
    """Tell browsers and proxies never to serve stale CMS JSON.

    Every block of the site (news, community feed, piscine countdown, services)
    is edited in the Django admin. Without explicit cache headers a browser can
    reuse an older API response after a reload, which makes an unrelated edit
    look like it erased or replaced another block. API responses are small, so
    disabling client-side caching is the simplest way to keep every page in
    sync with the CMS.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.path.startswith("/api/"):
            response["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
            response["Pragma"] = "no-cache"
            response["Expires"] = "0"
        return response
