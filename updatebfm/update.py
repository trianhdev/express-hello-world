
import json
import pandas as pd
from flatten_dict import flatten
from flatten_dict import unflatten
from flatten_dict.reducers import make_reducer
import os
import glob
# All files and directories ending with .txt and that don't begin with a dot:
print(glob.glob("org\*.json")) 
filelist=[os.path.basename(list_item) for list_item in glob.glob("org\*.json")]
print((filelist))
# load excel file
# df = pd.read_excel("BFMs.xlsx", sheet_name='Sheet1')
# print(df)
# load json file
# with open('de-DE.json', encoding='utf-8') as fh: de = json.load(fh)


# flatten json file
# dict1 = flatten(data, reducer='dot')

# update dict
# for i in df.index:
    # print({df['Key'][i]})
    # print(dict1[(df['Key'][i])])


# unflatten dict
# dict2 = unflatten(dict1, splitter='path')
# dict2= dict1


# export file
# os.mkdir(path, mode)
# with open('new\zh-CN.json', 'w', encoding='utf8') as outfile:
#     outfile.truncate(0)
#     json.dump(dict2, outfile, ensure_ascii=False)