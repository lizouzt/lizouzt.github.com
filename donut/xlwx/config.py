# -*- coding: UTF8 -*-

APPID = "wxacbfba98f3b42da9";
APPSECRET = "445f982f61002d92d385a84eb50dd592";
TOKEN = "xlwxbytzinc2014";

Mod_Text = '''<xml>
        <ToUserName><![CDATA[%s]]></ToUserName>
        <FromUserName><![CDATA[%s]]></FromUserName>
        <CreateTime>%s</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[%s]]></Content>
        <FuncFlag>0<FuncFlag>
        </xml>'''

Mod_News = {
	'item': '''<item>
            <Title><![CDATA[%s]]></Title>
            <Discription><![CDATA[%s]]></Discription>
            <PicUrl><![CDATA[%s]]></PicUrl>
            <Url><![CDATA[%s]]></Url>
            </item>''',

	'header': '''<xml>
             <ToUserName><![CDATA[%s]]></ToUserName>
             <FromUserName><![CDATA[%s]]></FromUserName>
             <CreateTime>%s</CreateTime>
             <MsgType><![CDATA[news]]></MsgType>
             <Content><![CDATA[%s]]></Content>
             <ArticleCount>%s</ArticleCount>
             <Articles>''',

    'footer': '''</Articles>
            <FuncFlag>0</FuncFlag>
            </xml>'''
}

Msg_Contact = '''开发中！购买欢迎来电咨询：
	            Office: 0834-3957722
	            Tel: 18508342016'''
Msg_Error = '''微信跪了, 帮忙通知一下店主吧！！'''

Msg_First_Page = [{
	'title': '火热单品',
	'des': '点击查看最新最热的手机周边配件。屌起来，只需要一瞬间！',
	'picturl': 'icon_items.png',
	'url': ''
},{
	'title': '门店位置',
	'des': '回复1：查看门店位置!',
	'picturl': 'icon_locate.png',
	'url': ''
},{
	'title': '联系方式',
	'des': '回复2：查看联系方式!',
	'picturl': 'icon_call.png',
	'url': ''
}]