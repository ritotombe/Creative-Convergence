import pandas as pd
import urllib.request as curl
import json
import pprint

event_url = "http://www.ausstage.edu.au/exchange/events?type=organisation&id=590&output=json&limit=all"

def request_and_parse_json(url_string):
    data_event = curl.urlopen(url_string).read()
    JSON_object = json.loads(data_event.decode("utf-8","ignore"))
    return JSON_object

event_raw = request_and_parse_json(event_url)
events = pd.DataFrame(event_raw)


print(events)
