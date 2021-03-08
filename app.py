from flask import *
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("main.html")


if __name__ == '__main__':
    app.run(debug=("DYNO" not in os.environ), threaded=True)