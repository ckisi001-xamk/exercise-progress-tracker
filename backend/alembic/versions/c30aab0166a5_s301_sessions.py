"""s301_sessions

Revision ID: c30aab0166a5
Revises: 4ebb24cbc7dc
Create Date: 2026-10-15 17:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'c30aab0166a5'
down_revision: Union[str, Sequence[str], None] = '4ebb24cbc7dc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. workout_sessions
    op.create_table(
        'workout_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('session_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('status', sa.String(length=20), server_default='planned', nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('intensity', sa.Integer(), nullable=True),
        sa.Column('source_session_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workout_sessions.id', ondelete='SET NULL'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.CheckConstraint("status IN ('planned', 'in_progress', 'completed')", name='ck_workout_sessions_status'),
        sa.CheckConstraint("intensity IS NULL OR (intensity >= 1 AND intensity <= 10)", name='ck_workout_sessions_intensity')
    )
    op.create_index('ix_workout_sessions_user_id', 'workout_sessions', ['user_id'])
    op.create_index('ix_workout_sessions_user_session_at', 'workout_sessions', ['user_id', 'session_at'])

    # 2. workout_session_items
    op.create_table(
        'workout_session_items',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workout_sessions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('activity_type_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('activity_types.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('sort_order', sa.Integer(), server_default='0', nullable=False),
        sa.Column('notes', sa.Text(), nullable=True)
    )
    op.create_index('ix_workout_session_items_session_id', 'workout_session_items', ['session_id'])
    op.create_index('ix_workout_session_items_activity_type_id', 'workout_session_items', ['activity_type_id'])

    # 3. workout_session_measurements
    op.create_table(
        'workout_session_measurements',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('session_item_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workout_session_items.id', ondelete='CASCADE'), nullable=False),
        sa.Column('unit_type_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('unit_types.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('planned_value', sa.Numeric(precision=12, scale=3), nullable=True),
        sa.Column('actual_value', sa.Numeric(precision=12, scale=3), nullable=True),
        sa.Column('set_index', sa.Integer(), nullable=True)
    )
    op.create_index('ix_workout_session_measurements_session_item_id', 'workout_session_measurements', ['session_item_id'])
    op.create_index('ix_workout_session_measurements_unit_type_id', 'workout_session_measurements', ['unit_type_id'])


def downgrade() -> None:
    op.drop_table('workout_session_measurements')
    op.drop_table('workout_session_items')
    op.drop_table('workout_sessions')
