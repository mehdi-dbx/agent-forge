"""Re-export from data.py.sql_utils for tools/ compatibility."""
from data.py.sql_utils import get_schema_qualified, substitute_schema

__all__ = ["get_schema_qualified", "substitute_schema"]
