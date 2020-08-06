from sqlalchemy import inspect, create_engine
from pprint import pprint


class Analyser:
    def __init__(self, dialect, user, passwd, host, dbname, driver):
        self.db_name = dbname
        conn_string = f'{dialect}+{driver}://{user}:{passwd}@{host}/{dbname}'
        self.engine = create_engine(conn_string, echo=None)
        self.inspector = inspect(self.engine)
        self.tables = self.inspector.get_table_names()

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
        for col in columns:
            is_pk = True if col["name"] in pks else False
            is_fk = True if col["name"] in fks else False
            info = {"name": col["name"], "type": repr(
                col["type"]), "primary key": is_pk, "foreign key": is_fk}
            column_info.append(info)
        return {"name": table_name, "columns": column_info}

    def get_relationships(self, table_name):
        pass

    def get_all_tables_info(self):
        all_tables = self.tables
        return [self._get_table_info(table) for table in all_tables]

    def get_all_info(self):
        return {"database": self.db_name, "tables": self.get_all_tables_info()}
