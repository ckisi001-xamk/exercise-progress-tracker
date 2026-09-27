from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from app.models.user import User
from app.models.activity_type import ActivityType
from app.models.unit_type import UnitType
from app.models.activity_type_unit_type import ActivityTypeUnitType
from app.core.config import settings

class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username = form.get("username")
        password = form.get("password")

        if username == settings.sqladmin_username and password == settings.sqladmin_password:
            request.session.update({"token": "admin_authenticated"})
            return True
        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        return "token" in request.session

class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.email, User.display_name, User.created_at]
    column_searchable_list = [User.email, User.display_name]
    form_excluded_columns = [User.password_hash]

class UnitTypeAdmin(ModelView, model=UnitType):
    column_list = [UnitType.id, UnitType.name, UnitType.slug, UnitType.unit_label, UnitType.is_system]
    column_searchable_list = [UnitType.name, UnitType.slug]

class ActivityTypeAdmin(ModelView, model=ActivityType):
    column_list = [ActivityType.id, ActivityType.name, ActivityType.slug, ActivityType.is_system, ActivityType.user_id]
    column_searchable_list = [ActivityType.name, ActivityType.slug]

class ActivityTypeUnitTypeAdmin(ModelView, model=ActivityTypeUnitType):
    name = "Activity Unit Link"
    name_plural = "Activity Unit Links"
    column_list = [
        ActivityTypeUnitType.id,
        ActivityTypeUnitType.activity_type,
        ActivityTypeUnitType.unit_type,
        ActivityTypeUnitType.sort_order,
        ActivityTypeUnitType.is_required,
        ActivityTypeUnitType.per_set,
    ]

def setup_admin(app, engine):
    authentication_backend = AdminAuth(secret_key=settings.sqladmin_secret_key)
    admin = Admin(app=app, engine=engine, authentication_backend=authentication_backend)
    admin.add_view(UserAdmin)
    admin.add_view(UnitTypeAdmin)
    admin.add_view(ActivityTypeAdmin)
    admin.add_view(ActivityTypeUnitTypeAdmin)
    return admin
