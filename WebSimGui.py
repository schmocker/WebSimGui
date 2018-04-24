from flask import Flask, render_template, request
import json

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def hello_world():
    if request.method == 'GET':
        return render_template("WebSimGui.html")
    elif request.method == 'POST':
        data = json.loads(request.form['data'])
        return json.dumps(data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
