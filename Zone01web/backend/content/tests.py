from django.test import TestCase

from content.models import Article, Category


class ArticleModelTests(TestCase):
    def test_category_relation(self):
        category = Category.objects.create(name="News", slug="news")
        article = Article.objects.create(title="Hello", slug="hello", category=category)

        self.assertEqual(article.category, category)
        self.assertIn(article, category.articles.all())
        self.assertEqual(article.status, Article.Status.DRAFT)
