"""s303_plans

Revision ID: e50cca0388c7
Revises: d40bba0277b6
Create Date: 2026-10-15 18:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'e50cca0388c7'
down_revision: Union[str, Sequence[str], None] = 'd40bba0277b6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. workout_plans
    op.create_table(
        'workout_plans',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('start_date', sa.Date(), nullable=True),
        sa.Column('length_weeks', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False)
    )
    op.create_index('ix_workout_plans_user_id', 'workout_plans', ['user_id'])

    # 2. plan_id to workout_sessions
    op.add_column('workout_sessions', sa.Column('plan_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workout_plans.id', ondelete='SET NULL'), nullable=True))
    op.create_index('ix_workout_sessions_plan_id', 'workout_sessions', ['plan_id'])
    op.create_index('ix_workout_sessions_plan_session_at', 'workout_sessions', ['plan_id', 'session_at'])


def downgrade() -> None:
    op.drop_index('ix_workout_sessions_plan_session_at', table_name='workout_sessions')
    op.drop_index('ix_workout_sessions_plan_id', table_name='workout_sessions')
    op.drop_column('workout_sessions', 'plan_id')
    op.drop_table('workout_plans')
