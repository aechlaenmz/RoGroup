import requests

url = 'http://localhost:3000/demote'
params = {'userid': '1888534815'}
headers = {'apikey': '_b7df1d1c-xasc-8558-2kdk-09d3a8a04241'}

response = requests.get(url, params=params, headers=headers)

if response.status_code == 200:
    try:
        data = response.json()
        print(data)
    except requests.exceptions.JSONDecodeError:
        print('Error: Response is not in JSON format.')
else:
    print(f'Error: {response.status_code}')
    print(response.text)
