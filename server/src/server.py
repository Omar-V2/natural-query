from sqlalchemy.exc import OperationalError, ProgrammingError
from analyse import Analyser
from pprint import pprint
from pymongo import MongoClient
from flask import Flask
from flask_restful import Resource, Api, reqparse, abort
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
api = Api(app)


CLIENT = MongoClient(host="mongodb:27017", username="mongo", password="root")
DB = CLIENT["natural-query"]


class Database(Resource):
    def get(self):
        # get all databases
        databases = DB["databases"]
        return [db for db in databases.find({}, {"_id": False, "password": False})], 200

    def post(self):
        # connect a new database
        db_args = ["user", "password", "host", "dbname"]
        parser = reqparse.RequestParser()
        [parser.add_argument(arg, type=str) for arg in db_args]
        args = parser.parse_args()

        databases = DB["databases"]
        try:
            analyser = Analyser(
                args["user"], args["password"], args["host"], args["dbname"]
            )
            info = analyser.get_all_info()
            # only sets table info if no current database with matching name and host is present
            update_result = databases.update_one(
                {
                    "database": args["dbname"],
                    "host": args["host"],
                    "user": args["user"],
                },
                {
                    "$setOnInsert": {
                        "tables": info["tables"],
                        "password": analyser.get_pass(),
                    }
                },
                upsert=True,
            )
            matched_count = update_result.matched_count
            if matched_count == 1:
                abort(
                    404, message="You are already connected to this database",
                )
            return info, 201
        # incorrect combination of db creds
        except OperationalError:
            abort(
                404,
                message="Could not connect to a database with the provided credentials",
            )
        # # consider returning insert(update) _id here
        # # could then use in get method above - get db by _id
        # return info, 201

    def put(self):
        """
        Method for updating the relationship keywords based on UI graph component.
        """
        db_args = [("dbname", str), ("host", str), ("user", str), ("joinInfo", list)]
        parser = reqparse.RequestParser()
        [parser.add_argument(arg[0], type=arg[1], location="json") for arg in db_args]
        args = parser.parse_args()
        databases = DB["databases"]
        for entry in args["joinInfo"]:
            databases.update_one(
                {
                    "database": args["dbname"],
                    "host": args["host"],
                    "user": args["user"],
                },
                {
                    "$set": {
                        "tables.$[parentTable].relationships.$[foreignTable].identifier": entry[
                            "label"
                        ]
                    }
                },
                array_filters=[
                    {"parentTable.name": entry["parentTable"]},
                    {"foreignTable.table": entry["foreignTable"]},
                ],
            )
        updated_db = databases.find_one(
            {"database": args["dbname"], "host": args["host"], "user": args["user"]},
            {"_id": False, "password": False},
        )
        return updated_db, 201


class Query(Resource):
    def post(self):
        """
        takes in a sql query as a string, executes the query
        and returns the data response as json
        """
        db_args = ["dbname", "host", "user", "query"]
        parser = reqparse.RequestParser()
        [parser.add_argument(arg, type=str) for arg in db_args]
        args = parser.parse_args()
        databases = DB["databases"]
        retrieved_db = databases.find_one(
            {"database": args["dbname"], "host": args["host"], "user": args["user"]}
        )
        try:
            analyser = Analyser(
                args["user"], retrieved_db["password"], args["host"], args["dbname"]
            )
            columns, data = analyser.execute_query(args["query"])
            return {"columns": columns, "data": data}, 201
        except ProgrammingError:
            abort(404, message="error in SQL query")


api.add_resource(Database, "/db")
api.add_resource(Query, "/query")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
