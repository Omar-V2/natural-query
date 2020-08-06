from sqlalchemy import create_engine, inspect
from pprint import pprint
from collections import defaultdict
from analyse import Analyser


def connect_to_db(dialect, user, psswd, host, dbname, driver):
    conn_string = f'{dialect}+{driver}://{user}:{psswd}@{host}/{dbname}'
    return create_engine(conn_string, echo=None)


engine = connect_to_db("postgresql", "postgres", "root",
                       "sqldb", "UCL", "psycopg2")
inspector = inspect(engine)


def get_all_tables():
    return inspector.get_table_names()


def get_column_info(table_name):
    column_info = []
    columns = inspector.get_columns(table_name)
    pks = inspector.get_primary_keys(table_name)
    fk = inspector.get_foreign_keys(table_name)
    fks = [entry["constrained_columns"][0] for entry in fk]
    for col in columns:
        is_pk = True if col["name"] in pks else False
        is_fk = True if col["name"] in fks else False
        info = {"name": col["name"], "type": repr(
            col["type"]), "primary key": is_pk, "foreign key": is_fk}
        column_info.append(info)
    # pprint({"table": table_name, "columns": column_info})


# def get_all_relationships():
#     all_tables = get_all_tables()
#     relationships = defaultdict(list)
#     for table in all_tables:
#         pass


get_column_info("enrolments")
get_column_info("students")


# for table_name in inspector.get_table_names():
fks = inspector.get_foreign_keys("enrolments")
pks = inspector.get_primary_keys("students")
columns = inspector.get_columns("students")

print("FOREIGN KEYS")
print(fks)
print(type(fks))
print([pprint(item) for item in fks])


# print("COLUMNS KEYS")
# print([pprint(item) for item in columns])
# print("PRIMARY KEYS")
# print([pprint(item) for item in pks])

# print("FK SORTED")
# fks = inspector.get_foreign_keys("students")
# pks = inspector.get_primary_keys("students")
# columns = inspector.get_columns("students")
# print(columns[0]['type'])
# print(type(columns[0]['type']))
# print(repr(columns[0]['type']))
# return {"table": "students", columns: [{}]}

# analyser = Analyser("postgresql", "postgres", "root",
#                     "sqldb", "UCL", "psycopg2")

# pprint(analyser.get_all_info())
