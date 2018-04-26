from flask import Flask, render_template, request
import json

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def hello_world():
    if request.method == 'GET':
        return render_template("WebSimGui.html", agent=get_agent())
    elif request.method == 'POST':
        data = json.loads(request.form['data'])
        return json.dumps(data)


def get_agent():
    agent = dict()
    for i in range(0, 5):
        model = dict()

        model['name'] = 'Model '+str(i)
        model['posX'] = 50
        model['posY'] = 100
        model['settings'] = '{x: 1}'

        input = dict()
        input['input_1'] = {'name': 'input 1'}
        input['input_2'] = {'name': 'input 2'}
        input['input_3'] = {'name': 'input 3'}
        input['input_4'] = {'name': 'input 4'}
        input['input_5'] = {'name': 'input 5'}
        model['inputs'] = input

        output = dict()
        output['output_1'] = {'name': 'output 1'}
        output['output_2'] = {'name': 'output 2'}
        model['outputs'] = output

        agent['model_'+str(i)] = model

    return json.dumps(agent)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
