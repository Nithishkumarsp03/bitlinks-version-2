from flask import Flask, jsonify

app = Flask(__name__)

# Welcome route
@app.route('/', methods=['GET'])
def welcome():
    return "Welcome to the AI Prediction API", 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
