# Generated by Django 4.2.5 on 2025-04-09 05:36

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Billing',
            fields=[
                ('billing_id', models.IntegerField(primary_key=True, serialize=False)),
                ('amount', models.FloatField()),
                ('payment_method', models.CharField(max_length=100)),
                ('payment_date', models.DateTimeField(auto_now_add=True)),
                ('due_date', models.DateTimeField()),
                ('payment_status', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'billing',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Device',
            fields=[
                ('device_id', models.IntegerField(primary_key=True, serialize=False)),
                ('device_type', models.CharField(max_length=100)),
                ('device_name', models.CharField(max_length=255)),
                ('registered_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'device',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Media',
            fields=[
                ('media_id', models.IntegerField(primary_key=True, serialize=False)),
                ('episode', models.IntegerField(blank=True, null=True)),
                ('description', models.TextField(blank=True, null=True)),
            ],
            options={
                'verbose_name_plural': 'Media',
                'db_table': 'media',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('movie_id', models.IntegerField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('poster', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('release_year', models.IntegerField(blank=True, null=True)),
                ('genre', models.CharField(blank=True, max_length=100, null=True)),
                ('duration', models.IntegerField(blank=True, null=True)),
                ('is_available', models.BooleanField()),
                ('imdb_id', models.CharField(blank=True, max_length=20, null=True, unique=True)),
                ('slug', models.SlugField(blank=True, unique=True)),
            ],
            options={
                'db_table': 'movies',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('review_id', models.IntegerField(primary_key=True, serialize=False)),
                ('rating', models.IntegerField()),
                ('review_text', models.CharField(blank=True, max_length=500, null=True)),
                ('review_date', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'reviews',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('role_id', models.IntegerField(primary_key=True, serialize=False)),
                ('role_name', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'roles',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='SubscriptionPlan',
            fields=[
                ('plan_id', models.IntegerField(primary_key=True, serialize=False)),
                ('plan_name', models.CharField(max_length=255)),
                ('price', models.FloatField()),
                ('max_devices', models.IntegerField()),
                ('hd_available', models.BooleanField()),
                ('ultra_hd_available', models.BooleanField()),
                ('duration_days', models.IntegerField()),
            ],
            options={
                'db_table': 'subscription_plan',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('user_id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=255, unique=True)),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('gender', models.CharField(blank=True, max_length=50, null=True)),
                ('age', models.IntegerField(blank=True, null=True)),
                ('religion', models.CharField(blank=True, max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'users',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='UserSubscription',
            fields=[
                ('user_subscription_id', models.IntegerField(primary_key=True, serialize=False)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
            ],
            options={
                'db_table': 'user_subscription',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='WatchHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('watch_duration', models.IntegerField()),
            ],
            options={
                'verbose_name_plural': 'Watch History',
                'db_table': 'watch_history',
                'managed': False,
            },
        ),
    ]
