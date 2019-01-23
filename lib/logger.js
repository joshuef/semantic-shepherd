"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bristol = _interopRequireDefault(require("bristol"));

var _palin = _interopRequireDefault(require("palin"));

var _commander = _interopRequireDefault(require("commander"));

var _cliOptions = _interopRequireDefault(require("./cli-options"));

var _path = _interopRequireDefault(require("path"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ourLog = new _bristol.default.Bristol(); // 	levels = error, warn, info, debug, and trace

let logLevel = _cliOptions.default.logLevel;
if (!logLevel) logLevel = 'warn';
if (typeof logLevel === 'boolean') logLevel = 'trace';

const rootFolder = _path.default.basename(_path.default.dirname(__dirname));

ourLog.addTarget('file', {
  file: _path.default.resolve(process.cwd(), _constants.logFileName)
}).withLowestSeverity('debug').withHighestSeverity('error');
ourLog.addTarget('file', {
  file: _path.default.resolve(__dirname, '..', _constants.logFileName)
}).withFormatter('human').withLowestSeverity('debug').withHighestSeverity('error');
ourLog.addTarget('console').withFormatter(_palin.default, {
  //shorten log output to contents of this folder.
  rootFolderName: rootFolder,
  objectDepth: 4 // more js output

}).withLowestSeverity(logLevel).withHighestSeverity('error');
process.on('uncaughtTypeError', err => {
  ourLog.error('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  ourLog.error('whoops! there was an uncaught type error:');
  ourLog.error(err);
  ourLog.error(err.file);
  ourLog.error(err.line);
});
process.on('uncaughtException', err => {
  ourLog.error('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  ourLog.error('whoops! there was an uncaught error:');
  ourLog.error(err);
  ourLog.error(err.file);
  ourLog.error(err.line);
});
process.on('unhandledRejection', (reason, p) => {
  ourLog.error('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  ourLog.error('Unhandled Rejection:');
  ourLog.error(reason);
});
var _default = ourLog;
exports.default = _default;