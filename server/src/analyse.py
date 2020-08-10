from collections import defaultdict
from sqlalchemy import inspect, create_engine
from pprint import pprint


class Analyser:
    def __init__(
        self, user, password, host, dbname, dialect="postgresql", driver="psycopg2"
    ):
        self.db_name = dbname
        conn_string = f"{dialect}+{driver}://{user}:{password}@{host}/{dbname}"
        self.engine = create_engine(conn_string, echo=None)
        self.inspector = inspect(self.engine)
        self.tables = self.inspector.get_table_names()
        self.relationships = self._get_relationships()

    def connect(self):
        pass

    def dissconnect(self):
        pass

    def _get_table_info(self, table_name):
        """
        Accepts a table name and returns a dictionary containing
        infomartion on each column in the table.
        """
        column_info = []
        columns = self.inspector.get_columns(table_name)
        pks = self.inspector.get_primary_keys(table_name)
        fk = self.inspector.get_foreign_keys(table_name)
        fks = [entry["constrained_columns"][0] for entry in fk]
        relationships = self.relationships[table_name]
        for col in columns:
            is_pk = True if col["name"] in pks else False
            is_fk = True if col["name"] in fks else False
            info = {
                "name": col["name"],
                "type": repr(col["type"]),
                "primary key": is_pk,
                "foreign key": is_fk,
            }
            column_info.append(info)
        return {
            "name": table_name,
            "columns": column_info,
            "relationships": relationships,
        }

    def _get_relationships(self):
        relationships = defaultdict(list)
        for table in self.tables:
            fks = self.inspector.get_foreign_keys(table)
            for entry in fks:
                referred_table = entry["referred_table"]
                parent_column = entry["referred_columns"][0]
                foreign_column = entry["constrained_columns"][0]
                relation = {
                    "table": table,
                    "parent column": parent_column,
                    "foreign column": foreign_column,
                    "identifier": None,
                }
                relationships[referred_table].append(relation)
        return relationships

    def _get_all_tables_info(self):
        all_tables = self.tables
        return [self._get_table_info(table) for table in all_tables]

    def get_all_info(self):
        return {"database": self.db_name, "tables": self._get_all_tables_info()}
