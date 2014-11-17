# -*- coding: UTF8 -*-
'''
Created on 2014-04-20

@author: Elfer
'''
import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.options
import time
import dataAnalysis
import config
import sys
try:
    sys.path.index('/var/www/taoz/')
except:
    sys.path.insert(0, '/var/www/taoz/')
reload(sys)
sys.setdefaultencoding('utf-8')

class MainHandler(tornado.web.RequestHandler):
    def initialize(self):
        self.analyzing = dataAnalysis.server()
        
    def get(self,param):
        echoStr = self.get_argument("echostr", None)
        signature=self.get_argument("signature", None)
        timestamp=self.get_argument("timestamp", None)
        nonce=self.get_argument("nonce", None)
        if(self.Check_Signature(signature,timestamp,nonce)):
            self.write(echoStr)
        
    def post(self,param):
        req = str(self.request.body)
        print param
        print '\r\n********',req,'**********\r\n'

        ret = False
        try:
            ret = self.analyzing.progressing()
        except Exception as e:
            print e

        if ret:
            context = self.analyzing.reply_logic_pros()
        else:
            context = self.analyzing.text_Format(config.Msg_Error)

        self.write(context)

    def Check_Signature(self,signature,timestamp,nonce):
        tmpArr=[config.TOKEN,timestamp,nonce]
        tmpArr.sort()
        tmpStr=''.join(tmpArr)
        if(hashlib.sha1(tmpStr).hexdigest()==signature):
            return True
        else:
            return False

application = tornado.web.Application([
        (r"/(favicon\.ico)", tornado.web.StaticFileHandler, {"path":"./static/"}),
        (r"/(.*)", MainHandler)
], gzip = True)

if __name__ == "__main__":
        print 'run'
        try:
            application.listen(8801)
            tornado.ioloop.IOLoop.instance().start()
        except Exception as e:
            print e