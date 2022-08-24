const puppeteer = require('puppeteer');
const defaultConfig = require('../config/puppeteerConfig');
const {getToday,getTimeDiff} = require('../utils/utils');
const MysqlDB = require('../database/connectMysql');
const BASEURL = 'http://www.variflight.com';
let siteMapUrl = '';
let siteCode = '';
let globeBrowser;
let flightListData = [];

process.on('exit', (code) => {
    console.log(`退出码: ${code}`);
});
async function getFightListData() {
    globeBrowser = await puppeteer.launch(defaultConfig.config);
    const page = await globeBrowser.newPage();
    page.setDefaultNavigationTimeout(50000);
    console.log("准备打开飞常准首页寻找航班列表页面");
    await page.goto(`${BASEURL}`, {waitUntil: 'networkidle2'});
    let elementPath = '';
    let parseResult = {};
    elementPath = '.f_t';
    await page.waitForSelector(elementPath);
    parseResult = await page.evaluate(() => {
        const items = document.querySelectorAll('.f_t a');
        let siteMap = '';
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].innerText.indexOf('航班列表') !== -1) {
                    siteMap = items[i].getAttribute('href');
                }
            }
        }
        return siteMap;
    });
    siteCode = getParam(parseResult);
    siteMapUrl = parseResult;
    console.log("准备打开飞常准航班列表页面");
    await page.goto(`${BASEURL}${siteMapUrl}`, {waitUntil: 'networkidle2'});
    elementPath = '.list';
    await page.waitForSelector(elementPath);
    parseResult = await page.evaluate(() => {
        const items = document.querySelectorAll('a');
        const tmpMap = [];
        if (items) {
            for (let i = 0; i < items.length; i++) {
                let linkText = "";
                let linkUrl = "";
                linkText = items[i].innerText ? items[i].innerText : '';
                linkUrl = items[i].getAttribute('href') ? items[i].getAttribute('href') : '';
                if (linkUrl.indexOf('html?') !== -1 && linkUrl != '' && linkText != '') {
                    tmpMap.push(linkText);
                }
            }
        }
        return tmpMap;
    });
    flightListData = parseResult;
    console.log(`获取到总共${flightListData.length}个航班`);
    let startTime=new Date();
    const DB = await MysqlDB('flight', 'tb_flight_list');
    for (let i = 0; i < flightListData.length; i++) {
        let _data = {};
        let dbRes;//数据库写入是否成功
        _data.fnum = flightListData[i];
        _data.createDate = getToday();
        dbRes = await DB.add(_data);
        let nowTime = new Date().toLocaleString();
        let endTime=new Date();
        console.log(getTimeDiff("航班列表写入数据库",startTime,endTime));
        if (dbRes) {
            console.log(`[${nowTime}]成功添加第${i+1}条数据`);
        } else {
            console.log(`[${nowTime}]添加失败第${i+1}条数据`);
        }
    }
    await DB.close();
    process.exit(1);
}

function getParam(str) {
    let params = str.split('?');
    return params[1];
}

getFightListData();
