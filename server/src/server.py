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
        # return json_util.loads(databases.find())
        return [x for x in databases.find({}, {"_id": False})]
        # return {"hello": "world"}

    def post(self):
        db_args = ["user", "password", "host", "dbname"]
        parser = reqparse.RequestParser()
        [parser.add_argument(arg, type=str) for arg in db_args]

        databases = DB["databases"]
        args = parser.parse_args()
        try:
            analyser = Analyser(
                args["user"], args["password"], args["host"], args["dbname"]
            )
            info = analyser.get_all_info()
            databases.update({"database": args["dbname"]}, info, upsert=True)
        # incorrect combination of db creds
        except OperationalError:
            abort(
                404,
                message="Could not connect to a database with the provided credentials",
            )

        # consider returning insert(update) _id here
        # could then use in get method above - get db by _id
        return info, 201


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
