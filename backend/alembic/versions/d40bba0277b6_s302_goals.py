"""s302_goals

Revision ID: d40bba0277b6
Revises: c30aab0166a5
Create Date: 2026-10-15 17:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'd40bba0277b6'
down_revision: Union[str, Sequence[str], None] = 'c30aab0166a5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'goals',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('unit_type_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('unit_types.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('activity_type_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('activity_types.id', ondelete='SET NULL'), nullable=True),
        sa.Column('target_value', sa.Numeric(precision=12, scale=3), nullable=False),
        sa.Column('period', sa.String(length=20), nullable=False),
        sa.Column('active', sa.Boolean(), server_default=sa.text('true'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.CheckConstraint("period IN ('week', 'month')", name='ck_goals_period')
    )
    op.create_index('ix_goals_user_id', 'goals', ['user_id'])
    op.create_index('ix_goals_unit_type_id', 'goals', ['unit_type_id'])
    op.create_index('ix_goals_activity_type_id', 'goals', ['activity_type_id'])


def downgrade() -> None:
    op.drop_table('goals')
