from flask import Flask, jsonify

import time

app = Flask(__name__)


@app.route('/get-query', methods=['GET'])
def get_query():
    # Simulate a 1-second delay
    time.sleep(1)
    # Return the JSON response
    return jsonify({"query": "Who are you?"})

# if __name__ == '__main__':
#     app.run(debug=True)
