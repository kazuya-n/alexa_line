"use strict";

const Alexa = require('ask-sdk-core');
var bodyParser = require('body-parser');
var request = require('request');

var LINE_CHANNEL_ACCESS_TOKEN = ""
var TO_ID = ""

// LINEを送る関数
// TODO APIエラー時のキャッチができてない
function PostLine(message) {

    var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
    }
    var body = {
        to : TO_ID,
        messages: [{
            type: 'text',
            text: String(message)
        }]
    }
    var url = 'https://api.line.me/v2/bot/message/push';
    request.post({
        url: url,
        headers: headers,
        body: JSON.stringify(body)
    }, function (error, response, body) {
        console.log(body);
    });
}

// LINEを送る
const HoroscopeIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'SendLine';
    },
    handle(handlerInput) {
        const Query = handlerInput.requestEnvelope.request.intent.slots.SendQuery.value;
        PostLine(Query);
        const speechOutput = Query + 'と、LINEを送りました。'; // 応答メッセージ文字列の作成

        //レスポンスの生成
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    },
};

// スキル起動時またはスキルの使い方を尋ねるインテントのハンドラ
const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest'
            || (request.type === 'IntentRequest'
                && request.intent.name === 'AMAZON.HelpIntent');
    },
    handle(handlerInput) {
        const speechOutput = '家族にLINEを送ります。' +
            'たとえば、「おはようと送って」といってください。';
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

// Lambda関数のメイン処理
exports.handler = skillBuilder
    .addRequestHandlers(
        HoroscopeIntentHandler,
        HelpHandler
    )
    .lambda();
