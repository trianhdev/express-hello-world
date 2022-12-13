
import json
import pandas as pd
from flatten_dict import flatten
from flatten_dict import unflatten
from flatten_dict.reducers import make_reducer
import os
import glob


# load update excel file
updatedf = pd.read_excel("update.xlsx", sheet_name='Sheet1',index_col=0)


# load json file name
filepath=glob.glob("org\*.json")
filelist=[os.path.basename(list_item) for list_item in glob.glob("org\*.json")]
exportfile = pd.DataFrame()
for file in filepath:
    filename =os.path.splitext(os.path.basename(file))[0]
    with open(file, encoding='utf-8') as fh: 
        data = json.load(fh)
        # flatten json file
        dict1 = flatten(data, reducer='dot')

        # export current text for backup
        exportfile[filename] = pd.DataFrame.from_dict(dict1, orient='index',columns=["content"])["content"]
        
        # update dict1
        if filename in updatedf.columns:
            for key in updatedf.index:
                dict1[key] =updatedf.loc[key,filename]

        # unflatten dict1
        dict2 = unflatten(dict1, splitter='dot')
        # dict2= dict1
        
        # export file
        with open('new\\'+filename+'.json', 'w', encoding='utf8') as outfile:
            outfile.truncate(0)
            json.dump(dict2, outfile, ensure_ascii=False)

# export current text for backup
# exportfile.to_excel("backup.xlsx")
           
