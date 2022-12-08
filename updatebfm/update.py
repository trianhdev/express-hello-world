
import json
import pandas as pd
from flatten_dict import flatten
from flatten_dict import unflatten
import os

# load excel file
df = pd.read_excel("BFMs.xlsx", sheet_name='Sheet1')

# load json file
with open('zh-CN.json', encoding='utf-8') as fh:
    data = json.load(fh)

# flatten json file
dict1 = flatten(data, reducer='path')

# update dict
for i in df.index:
    # print({df['Key'][i]})
    print(dict1[(df['Key'][i])])


# unflatten dict
# dict2 = unflatten(dict1, splitter='path')
dict2= dict1


# export file
# os.mkdir(path, mode)
with open('new\zh-CN.json', 'w', encoding='utf8') as outfile:
    outfile.truncate(0)
    json.dump(dict2, outfile, ensure_ascii=False)