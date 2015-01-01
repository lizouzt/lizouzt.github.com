# -*- coding: UTF8 -*-
import json
import time
import config

class server():
    def __init__(self):
        self.userName = self.serverName = self.content = ''
        self.dirtyPicture = 'http://121.199.7.39/taoz/static/'

    def progressing(self, req):
        self.userName = self.node_Analysis(req, 'FromUserName')
        self.serverName = self.node_Analysis(req, 'ToUserName')
        self.content = self.node_Analysis(req, "Content")
        
        print '\r\n',userName,'----',serverName,'----',content,'----',timeStamp,'\r\n'

        if self.userName == '' or self.serverName == '':
            return False

        self.timeStamp = str(time.time())

        return True

    def node_Analysis(self,re,name):
        if name in re:
            data = re.split(name)[1]
            data = data.split(name)[0]
            data = data[10:-5]
            return  data
        else:
            print 'msg Analysis erro!!'
            return ''

    def node_Type2_Analysis(self,re,name):
        re = str(re)
        if name in re:
            data = re.split(name)[1]
            data = data.split(name)[0]
            data = data[1:-2]
            return data
        else:
            print 'msg Analysis erro!!'
            return ''
    
    def reply_logic_pros(self):
        if content == '1':
            return send_slocation()
        elif content == '2':
            return send_xman_contact()
        else:
            return send_first_shot()

    def send_xman_contact(self):
        content = config.Msg_Contact
        print 'xxxxxxxxxxxxxxxx:  ',self.timeStamp
        msg = text_Format(content)
        return msg

    def send_slocation(self):
        pass

    def send_first_shot(self):
        data = json.loads(config.Msg_First_Page)
        count = len(data)
        msg = news_Format(data, count)
        return msg

    def text_Format(self, content):
        msgtext = config.Mod_Text % (self.userName,self.serverName,self.timeStamp,content)
        return msgtext

    def news_Format(self,data,count):
        msgtext = config.Mod_News['header'] % (self.userName,self.serverName,self.timeStamp,count)
        
        itemTpl = config.Mod_News['item']
        for i in range(0, count):
            item = data[i]
            uri = self.dirtyPicture + item['url']
            msgtext += itemTpl % (item['title'],item['description'],item['picurl'],uri)

        msgtext += config.Mod_News['footer']

        return msgtext;