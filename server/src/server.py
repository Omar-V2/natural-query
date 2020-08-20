from sqlalchemy.exc import OperationalError
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
        # get database by name
        databases = DB["databases"]
        return [db for db in databases.find({}, {"_id": False})], 200
        # can use combo string of host, dbname, and login as unique identifier
        # return json_util.loads(databases.find())
        # return [x for x in databases.find({}, {"_id": False})]

    def post(self):
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
            update_result = databases.update_one(
                {"database": args["dbname"], "host": args["host"]},
                {"$setOnInsert": {"tables": info["tables"]}},
                upsert=True,
            )
            # matched_count = update_result.matched_count
            # if matched_count == 1:
            #     abort(
            #         404, message="You are already connected to this database",
            #     )
            return info, 201
        # incorrect combination of db creds
        except OperationalError:
            abort(
                404,
                message="Could not connect to a database with the provided credentials",
            )

        # consider returning insert(update) _id here
        # could then use in get method above - get db by _id
        return info, 201

    def put(self):
        """
        Method for updating the relationship keywords based on UI graph component.
        """
        db_args = [("dbname", str), ("host", str), ("joinInfo", list)]
        parser = reqparse.RequestParser()
        [parser.add_argument(arg[0], type=arg[1], location="json") for arg in db_args]
        args = parser.parse_args()
        databases = DB["databases"]
        for entry in args["joinInfo"]:
            databases.update_one(
                {"database": args["dbname"], "host": args["host"]},
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
            {"database": args["dbname"], "host": args["host"]}, {"_id": False}
        )
        return updated_db, 201


class Query(Resource):
    def post(self):
        """
        takes in a sql query as a string, executes the query
        and returns the data response as json
        """
        pass


api.add_resource(Database, "/db")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
